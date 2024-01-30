'use client';
import { navigations } from '@/constants/navigation';
import type { Classes, MenuExp } from '@/types';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Dropdown } from 'flowbite-react';
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

const AuthDisplay = () => {
  const { user, error, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontWeight: 500,
        margin: '12px 0',
      }}
    >
      {user && user?.name && (
        <Image
          width={40}
          height={40}
          src={user.picture!}
          alt={user.name!}
          style={{ borderRadius: '50%', fontWeight: 700 }}
        />
      )}

      {user && user?.name ? (
        <a href='/api/auth/logout'>Logout</a>
      ) : (
        <a href='/api/auth/login'>Login</a>
      )}
      <a href='/api/auth/login'>Login</a>
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
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
