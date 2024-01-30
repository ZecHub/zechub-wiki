'use client';
import { navigations } from '@/constants/navigation';
import type { Classes, MenuExp } from '@/types';
import { Dropdown, Spinner, Tooltip } from 'flowbite-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  MdOutlineDarkMode as DarkIcon,
  MdLightMode as LightIcon,
} from 'react-icons/md';
import {
  RiCloseFill as CloseIcon,
  RiMenuLine as MenuIcon,
} from 'react-icons/ri';
import { Icon } from './ui/Icon';
import Logo from './ui/Logo';
import SocialIcons from './ui/SocialIcons';

type SVGProps = {
  width: number;
  height: number;
};
const SignInIcon = (props: SVGProps) => {
  return (
    <svg
      width={props.width}
      height={props.height}
      viewBox='0 0 595 594'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle cx='298' cy='297' r='297' fill='#14773C' />
      <path
        d='M115.574 231.302C103.142 226.804 96.592 213.002 102.429 201.14C121.65 162.076 152.261 129.503 190.479 107.896C235.676 82.3441 288.527 73.8153 339.467 83.8533C390.407 93.8912 436.071 121.833 468.195 162.621C500.319 203.409 516.78 254.35 514.601 306.224C512.421 358.098 491.744 407.478 456.311 445.427C420.879 483.377 373.032 507.389 321.429 513.118C269.827 518.847 217.878 505.915 174.984 476.662C138.713 451.925 110.943 416.899 95.0663 376.36C90.2451 364.049 97.9295 350.846 110.696 347.407V347.407C123.462 343.968 136.445 351.625 141.647 363.78C154.289 393.318 175.145 418.819 201.961 437.107C235.405 459.916 275.911 470 316.146 465.533C356.381 461.065 393.688 442.343 421.316 412.753C448.943 383.163 465.065 344.661 466.765 304.214C468.464 263.767 455.629 224.048 430.581 192.245C405.534 160.441 369.929 138.655 330.21 130.828C290.491 123.001 249.283 129.651 214.042 149.575C185.787 165.549 162.865 189.209 147.79 217.583C141.586 229.258 128.007 235.8 115.574 231.302V231.302Z'
        fill='#fff'
      />
      <path
        d='M95 285.5C88.6487 285.5 83.5 290.649 83.5 297C83.5 303.351 88.6487 308.5 95 308.5L95 285.5ZM356.132 305.132C360.623 300.641 360.623 293.359 356.132 288.868L282.946 215.683C278.455 211.192 271.174 211.192 266.683 215.683C262.192 220.174 262.192 227.455 266.683 231.946L331.737 297L266.683 362.054C262.192 366.545 262.192 373.826 266.683 378.317C271.174 382.808 278.455 382.808 282.946 378.317L356.132 305.132ZM95 308.5L348 308.5L348 285.5L95 285.5L95 308.5Z'
        fill='white'
      />
    </svg>
  );
};
const SignOutIcon = (props: SVGProps) => {
  return (
    <svg
      width={props.width}
      height={props.height}
      viewBox='0 0 594 594'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle
        cx='297'
        cy='297'
        r='297'
        transform='rotate(90 297 297)'
        fill='red'
      />
      <path
        d='M356.353 112.887C360.415 100.305 373.979 93.2777 386.039 98.6971C425.75 116.543 459.371 145.998 482.298 183.44C509.412 227.717 519.78 280.238 511.526 331.497C503.272 382.756 476.941 429.368 437.299 462.896C397.656 496.424 347.321 514.653 295.403 514.285C243.485 513.917 193.413 494.976 154.25 460.889C115.087 426.803 89.4196 379.823 81.893 328.452C74.3664 277.081 85.4779 224.712 113.217 180.824C136.673 143.711 170.708 114.735 210.668 97.4541C222.803 92.2061 236.267 99.425 240.149 112.063V112.063C244.031 124.702 236.832 137.944 224.866 143.567C195.787 157.232 171.03 178.966 153.689 206.403C132.061 240.624 123.397 281.456 129.265 321.511C135.134 361.566 155.147 398.197 185.683 424.775C216.219 451.352 255.261 466.121 295.742 466.408C336.224 466.695 375.471 452.481 406.381 426.339C437.291 400.197 457.821 363.853 464.257 323.886C470.693 283.918 462.609 242.967 441.468 208.443C424.517 180.763 400.071 158.68 371.188 144.604C359.304 138.812 352.292 125.469 356.353 112.887V112.887Z'
        fill='#fff'
      />
      <line
        x1='303.567'
        y1='71.7705'
        x2='303.567'
        y2='261.771'
        stroke='white'
        stroke-width='31'
        stroke-linecap='round'
      />
    </svg>
  );
};

const AuthDisplay = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') return <Spinner />;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontWeight: 500,
      }}
    >
      {status === 'authenticated' && session?.user?.name && (
        <Image
          width={30}
          height={30}
          src={session.user.image!}
          alt={session.user.name!}
          style={{ borderRadius: '50%', fontWeight: 700 }}
        />
      )}

      {status === 'authenticated' ? (
        <button onClick={() => signOut()}>
          <Tooltip content='Sign out' placement='left'>
            <SignOutIcon width={30} height={30} />
          </Tooltip>
        </button>
      ) : (
        <button onClick={() => signIn('github')} style={{ minWidth: '60px' }}>
          Sign in
        </button>
      )}
    </div>
  );
};

const NavLinks = ({ classes, menuExp }: Classes) => {
  const router = useRouter();

  return (
    <div className={`flex ${menuExp ? 'flex-col' : 'flex-row'} ${classes}`}>
      {navigations.map((item) => (
        <Dropdown
          className='flex flex-row font-medium'
          key={item.name}
          label={item.name}
          color='inherit'
          trigger={menuExp ? 'click' : 'hover'}
        >
          {item.links.map((link) => (
            <Dropdown.Item
              type='button'
              key={link.path}
              onClick={() => {
                router.push(link.path);
              }}
            >
              {link.subName}
            </Dropdown.Item>
          ))}
        </Dropdown>
      ))}
    </div>
  );
};

const MobileNav = ({ menuExpanded }: MenuExp) => {
  return (
    <div className='absolute flex flex-col w-11/12 h-auto justify-center z-10'>
      {/* Menu */}
      <div
        className={`${
          !menuExpanded ? 'hidden' : 'flex'
        } shadow flex-col p-6 absolute top-20 px-8 w-full ml-11 rounded-xl transition duration-200`}
      >
        <ul className='list-none flex items-start flex-1 flex-col'>
          <NavLinks classes='font-bold' menuExp={menuExpanded} />
        </ul>

        <div className='flex flex-1 p-2 top-10 justify-start items-start mt-3'>
          <SocialIcons newTab={true} />
        </div>
        <AuthDisplay />
      </div>
    </div>
  );
};

const Navigation = () => {
  const [dark, setDark] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);

  useEffect(() => {
    const html: HTMLElement = document.querySelector('html')!;
    const body: HTMLBodyElement = document.querySelector('body')!;
    const activeClassesHtml = ['dark'];
    const activeBody = [
      'bg-slate-900',
      'text-white',
      'transition',
      'duration-500',
    ];
    if (html && dark) {
      activeClassesHtml.forEach((activeClass) =>
        html.classList.add(activeClass)
      );
      activeBody.forEach((activeClass) => body.classList.add(activeClass));
    } else if (html.classList.contains(activeClassesHtml[0])) {
      activeClassesHtml.forEach((activeClass) =>
        html.classList.remove(activeClass)
      );
      activeBody.forEach((activeClass) => body.classList.remove(activeClass));
    }
  }, [dark]);

  return (
    <div
      className={`flex w-full md:h-30 border-b-4 border-slate-500 dark:border-slate-100 mb-3 md:py-5 md:mx-auto ${
        menuExpanded ? 'mb-[120%]' : ''
      }`}
    >
      <div className='w-50 md:w-28 h-full p-2 flex flex-wrap md:space-x-2'>
        <Link href={'/'} className='hover:cursor-pointer'>
          <Logo />
        </Link>
      </div>

      <nav className='flex flex-wrap w-full sm:justify-end space-x-7 md:space-x-11'>
        {menuExpanded && (
          <div className='flex justify-center'>
            <MobileNav menuExpanded={menuExpanded} />
          </div>
        )}
        <div
          className={`flex flex-wrap space-between font-bold text-base items-center hidden md:flex`}
        >
          <NavLinks classes={''} menuExp={menuExpanded} />
        </div>

        <div className='flex  w-auto md:w-1/4 p-5 md:justify-end'>
          <Icon
            size={25}
            icon={dark ? LightIcon : DarkIcon}
            className='hover:cursor-pointer'
            onClick={() => setDark(!dark)}
          />
        </div>
        <div className='hidden md:flex p-5 w-auto md:w-40 justify-end'>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <SocialIcons newTab={false} />
            <AuthDisplay />
          </div>
        </div>
        <div className=' w-auto md:hidden hover:cursor-pointer p-5'>
          <Icon
            className='transition duration-500'
            size={25}
            icon={menuExpanded ? CloseIcon : MenuIcon}
            onClick={() => setMenuExpanded(!menuExpanded)}
          />
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
