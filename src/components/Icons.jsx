// Small inline SVG icons. They are decorative: pair them with visible text or an aria-label.

function Icon({ children, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export const SearchIcon = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
)

export const HeartIcon = ({ filled = false, ...props }) => (
  <Icon {...props} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.7 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.3 0 5.4 3.1 4.2 6.6-1.7 4.8-9.2 9.4-9.2 9.4Z" />
  </Icon>
)

export const MenuIcon = (props) => (
  <Icon {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
)

export const CloseIcon = (props) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
)

export const ArrowRightIcon = (props) => (
  <Icon {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
)

export const ChevronLeftIcon = (props) => (
  <Icon {...props}>
    <path d="m15 5-7 7 7 7" />
  </Icon>
)

export const ChevronRightIcon = (props) => (
  <Icon {...props}>
    <path d="m9 5 7 7-7 7" />
  </Icon>
)

export const FilterIcon = (props) => (
  <Icon {...props}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </Icon>
)

export const InfoIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Icon>
)
