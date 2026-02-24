'use client'

interface CopyrightFooterProps {
  darkMode?: boolean
}

export function CopyrightFooter({ darkMode }: CopyrightFooterProps) {
  return (
    <footer className={`py-2 px-4 text-right ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
      <p className="text-[10px]">
        © Harish Rawat
      </p>
    </footer>
  )
}
