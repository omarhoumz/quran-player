import cx from 'classnames'

export default function Button({ size = 'md', children, outline, ...props }) {
  return (
    <button
      className={cx('rounded border', {
        'px-2 py-1 text-sm': size === 'sm',
        'px-3 py-2': size === 'md',
        'text-teal-700 border-current': outline,
        'bg-teal-700 border-teal-700 text-white': !outline,
      })}
      {...props}
    >
      {children}
    </button>
  )
}
