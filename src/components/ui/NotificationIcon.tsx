type NotificationIconProps = {
  handleOnClick: () => void;
  fillColor?: string | 'currentColor';
  path: string;
};
export const NotificationIcon = (props: NotificationIconProps) => {
  return (
    <>
      <svg
        onClick={props.handleOnClick}
        className='w-8 h-8 text-gray-800 dark:text-white'
        aria-hidden='true'
        xmlns='http://www.w3.org/2000/svg'
        fill={props.fillColor}
        viewBox='0 0 24 24'
      >
        <path d={props.path} />
      </svg>
    </>
  );
};
