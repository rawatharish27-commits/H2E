// Admin Role-Based Access Control System
// Prevents admin abuse and ensures proper access management

import { db } from '@/lib/db'

// Permission types
export type Permission =
  // User management
  | 'VIEW_USERS'
  | 'EDIT_USERS'
  | 'BAN_USERS'
  | 'DELETE_USERS'
  | 'SHADOW_BAN_USERS'
  
  // Payment management
  | 'VIEW_PAYMENTS'
  | 'APPROVE_PAYMENTS'
  | 'REJECT_PAYMENTS'
  | 'REFUND_PAYMENTS'
  
  // Content moderation
  | 'VIEW_REPORTS'
  | 'REVIEW_REPORTS'
  | 'MODERATE_CONTENT'
  | 'DELETE_PROBLEMS'
  
  // System management
  | 'VIEW_ANALYTICS'
  | 'MANAGE_SETTINGS'
  | 'MANAGE_ADMINS'
  | 'VIEW_AUDIT_LOGS'
  
  // Security
  | 'VIEW_SECURITY_EVENTS'
  | 'RESOLVE_SECURITY_EVENTS'
  | 'MANAGE_CONTENT_FILTERS'

// Default role definitions
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  super_admin: [
    'VIEW_USERS', 'EDIT_USERS', 'BAN_USERS', 'DELETE_USERS', 'SHADOW_BAN_USERS',
    'VIEW_PAYMENTS', 'APPROVE_PAYMENTS', 'REJECT_PAYMENTS', 'REFUND_PAYMENTS',
    'VIEW_REPORTS', 'REVIEW_REPORTS', 'MODERATE_CONTENT', 'DELETE_PROBLEMS',
    'VIEW_ANALYTICS', 'MANAGE_SETTINGS', 'MANAGE_ADMINS', 'VIEW_AUDIT_LOGS',
    'VIEW_SECURITY_EVENTS', 'RESOLVE_SECURITY_EVENTS', 'MANAGE_CONTENT_FILTERS'
  ],
  
  admin: [
    'VIEW_USERS', 'EDIT_USERS', 'BAN_USERS', 'SHADOW_BAN_USERS',
    'VIEW_PAYMENTS', 'APPROVE_PAYMENTS', 'REJECT_PAYMENTS',
    'VIEW_REPORTS', 'REVIEW_REPORTS', 'MODERATE_CONTENT', 'DELETE_PROBLEMS',
    'VIEW_ANALYTICS', 'VIEW_AUDIT_LOGS',
    'VIEW_SECURITY_EVENTS', 'RESOLVE_SECURITY_EVENTS'
  ],
  
  moderator: [
    'VIEW_USERS',
    'VIEW_PAYMENTS', 'APPROVE_PAYMENTS',
    'VIEW_REPORTS', 'REVIEW_REPORTS', 'MODERATE_CONTENT', 'DELETE_PROBLEMS',
    'VIEW_SECURITY_EVENTS'
  ],
  
  support: [
    'VIEW_USERS', 'EDIT_USERS',
    'VIEW_PAYMENTS',
    'VIEW_REPORTS', 'REVIEW_REPORTS',
    'VIEW_SECURITY_EVENTS'
  ]
}

export interface AdminUser {
  id: string
  userId: string
  roleName: string
  permissions: Permission[]
  isActive: boolean
}

/**
 * Check if user has admin access
 */
export async function checkAdminAccess(userId: string): Promise<AdminUser | null> {
  const assignment = await db.adminAssignment.findFirst({
    where: {
      userId,
      isActive: true
    },
    include: {
      role: true
    }
  })
  
  if (!assignment) return null
  
  // Check if user is also flagged/blocked
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { isBanned: true, isBlocked: true }
  })
  
  if (user?.isBanned || user?.isBlocked) return null
  
  const permissions = JSON.parse(assignment.role.permissions) as Permission[]
  
  return {
    id: assignment.id,
    userId: assignment.userId,
    roleName: assignment.role.name,
    permissions,
    isActive: assignment.isActive
  }
}

/**
 * Check if admin has specific permission
 */
export function hasPermission(admin: AdminUser, permission: Permission): boolean {
  return admin.permissions.includes(permission)
}

/**
 * Check if admin has any of the specified permissions
 */
export function hasAnyPermission(admin: AdminUser, permissions: Permission[]): boolean {
  return permissions.some(p => admin.permissions.includes(p))
}

/**
 * Check if admin has all specified permissions
 */
export function hasAllPermissions(admin: AdminUser, permissions: Permission[]): boolean {
  return permissions.every(p => admin.permissions.includes(p))
}

/**
 * Initialize default admin roles
 */
export async function initializeAdminRoles(): Promise<void> {
  const existingCount = await db.adminRole.count()
  if (existingCount > 0) return
  
  for (const [name, permissions] of Object.entries(ROLE_PERMISSIONS)) {
    await db.adminRole.create({
      data: {
        name,
        permissions: JSON.stringify(permissions),
        description: getRoleDescription(name)
      }
    })
  }
}

/**
 * Assign admin role to user
 */
export async function assignAdminRole(
  userId: string,
  roleName: string,
  assignedBy: string
): Promise<{ success: boolean; error?: string }> {
  // Check if assigner has permission
  const assignerAdmin = await checkAdminAccess(assignedBy)
  if (!assignerAdmin || !hasPermission(assignerAdmin, 'MANAGE_ADMINS')) {
    return { success: false, error: 'Insufficient permissions' }
  }
  
  // Check if role exists
  const role = await db.adminRole.findUnique({
    where: { name: roleName }
  })
  
  if (!role) {
    return { success: false, error: 'Role not found' }
  }
  
  // Check if already assigned
  const existing = await db.adminAssignment.findFirst({
    where: { userId, roleId: role.id }
  })
  
  if (existing) {
    // Reactivate if inactive
    await db.adminAssignment.update({
      where: { id: existing.id },
      data: { isActive: true }
    })
    return { success: true }
  }
  
  // Create new assignment
  await db.adminAssignment.create({
    data: {
      userId,
      roleId: role.id,
      assignedBy
    }
  })
  
  // Log action
  await db.adminLog.create({
    data: {
      adminId: assignedBy,
      action: 'ASSIGN_ADMIN_ROLE',
      targetType: 'USER',
      targetId: userId,
      details: `Assigned role: ${roleName}`
    }
  })
  
  return { success: true }
}

/**
 * Remove admin role from user
 */
export async function removeAdminRole(
  userId: string,
  removedBy: string
): Promise<{ success: boolean; error?: string }> {
  const removerAdmin = await checkAdminAccess(removedBy)
  if (!removerAdmin || !hasPermission(removerAdmin, 'MANAGE_ADMINS')) {
    return { success: false, error: 'Insufficient permissions' }
  }
  
  await db.adminAssignment.updateMany({
    where: { userId },
    data: { isActive: false }
  })
  
  await db.adminLog.create({
    data: {
      adminId: removedBy,
      action: 'REMOVE_ADMIN_ROLE',
      targetType: 'USER',
      targetId: userId
    }
  })
  
  return { success: true }
}

/**
 * Get all admins with their roles
 */
export async function getAllAdmins(): Promise<Array<{
  id: string
  userId: string
  userName: string | null
  userPhone: string
  roleName: string
  assignedAt: Date
  isActive: boolean
}>> {
  const assignments = await db.adminAssignment.findMany({
    where: { isActive: true },
    include: {
      user: true,
      role: true
    }
  })
  
  return assignments.map(a => ({
    id: a.id,
    userId: a.userId,
    userName: a.user.name,
    userPhone: a.user.phone,
    roleName: a.role.name,
    assignedAt: a.assignedAt,
    isActive: a.isActive
  }))
}

/**
 * Verify admin action is logged
 */
export async function verifyAndLogAction(
  adminId: string,
  action: string,
  targetType: 'USER' | 'PAYMENT' | 'PROBLEM' | 'REPORT' | 'SYSTEM',
  requiredPermission: Permission,
  targetId?: string,
  details?: string
): Promise<{ allowed: boolean; error?: string }> {
  const admin = await checkAdminAccess(adminId)
  
  if (!admin) {
    return { allowed: false, error: 'Admin access required' }
  }
  
  if (!hasPermission(admin, requiredPermission)) {
    return { allowed: false, error: `Permission ${requiredPermission} required` }
  }
  
  // Log the action
  await db.adminLog.create({
    data: {
      adminId,
      action,
      targetType,
      targetId,
      details
    }
  })
  
  return { allowed: true }
}

/**
 * Get role description
 */
function getRoleDescription(roleName: string): string {
  const descriptions: Record<string, string> = {
    super_admin: 'Full system access including admin management',
    admin: 'Full access except admin management',
    moderator: 'Content and payment moderation',
    support: 'View and basic edit access for support'
  }
  return descriptions[roleName] || 'Custom role'
}

/**
 * Middleware helper for API routes
 */
export async function requireAdmin(
  userId: string | null,
  permission: Permission
): Promise<{ admin: AdminUser } | { error: string }> {
  if (!userId) {
    return { error: 'Authentication required' }
  }
  
  const admin = await checkAdminAccess(userId)
  
  if (!admin) {
    return { error: 'Admin access required' }
  }
  
  if (!hasPermission(admin, permission)) {
    return { error: `Permission denied: ${permission}` }
  }
  
  return { admin }
}
