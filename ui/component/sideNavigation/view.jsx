// @flow
import type { Node } from 'react';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import classnames from 'classnames';
import NotificationBubble from 'component/notificationBubble';
import { EXTRA_SIDEBAR_LINKS } from 'homepage';
// @if TARGET='app'
import { IS_MAC } from 'component/app/view';
// @endif

const ESCAPE_KEY_CODE = 27;
const BACKSLASH_KEY_CODE = 220;

const HOME = {
  title: 'Home',
  navigate: `/`,
  icon: ICONS.HOME,
};

const RECENT_FROM_FOLLOWING = {
  title: 'Following',
  navigate: `/$/${PAGES.CHANNELS_FOLLOWING}`,
  icon: ICONS.SUBSCRIBE,
};

// const TOP_LEVEL_LINKS: Array<{
//   title: string,
//   navigate: string,
//   icon: string,
//   extra?: Node,
//   hideForUnauth?: boolean,
// }> = [
//   HOME,
//   RECENT_FROM_FOLLOWING,
//   {
//     title: 'Your Tags',
//     navigate: `/$/${PAGES.TAGS_FOLLOWING}`,
//     icon: ICONS.TAG,
//     hideForUnauth: true,
//   },
//   {
//     title: 'Discover',
//     navigate: `/$/${PAGES.DISCOVER}`,
//     icon: ICONS.DISCOVER,
//   },
//   {
//     title: 'Purchased',
//     navigate: `/$/${PAGES.LIBRARY}`,
//     icon: ICONS.PURCHASED,
//     hideForUnauth: true,
//   },
// ];
const ODYSEE_LINKS = [HOME, ...EXTRA_SIDEBAR_LINKS, RECENT_FROM_FOLLOWING];

type Props = {
  subscriptions: Array<Subscription>,
  followedTags: Array<Tag>,
  email: ?string,
  uploadCount: number,
  doSignOut: () => void,
  sidebarOpen: boolean,
  setSidebarOpen: boolean => void,
  isMediumScreen: boolean,
  isOnFilePage: boolean,
  unreadCount: number,
  purchaseSuccess: boolean,
  doClearPurchasedUriSuccess: () => void,
  user: ?User,
};

function SideNavigation(props: Props) {
  const {
    subscriptions,
    followedTags,
    doSignOut,
    email,
    purchaseSuccess,
    doClearPurchasedUriSuccess,
    sidebarOpen,
    setSidebarOpen,
    isMediumScreen,
    isOnFilePage,
    unreadCount,
    user,
  } = props;

  const ABSOLUTE_LINKS: Array<{
    title: string,
    navigate?: string,
    onClick?: () => any,
    icon: string,
    extra?: Node,
    hideForUnauth?: boolean,
  }> = [
    {
      title: 'Upload',
      navigate: `/$/${PAGES.UPLOAD}`,
      icon: ICONS.PUBLISH,
    },
    {
      title: 'New Channel',
      navigate: `/$/${PAGES.CHANNEL_NEW}`,
      icon: ICONS.CHANNEL,
      hideForUnauth: true,
    },
    {
      title: 'Uploads',
      navigate: `/$/${PAGES.UPLOADS}`,
      icon: ICONS.PUBLISH,
      hideForUnauth: true,
    },

    {
      title: 'Channels',
      navigate: `/$/${PAGES.CHANNELS}`,
      icon: ICONS.CHANNEL,
      hideForUnauth: true,
    },
    {
      title: 'Creator Analytics',
      navigate: `/$/${PAGES.CREATOR_DASHBOARD}`,
      icon: ICONS.ANALYTICS,
      hideForUnauth: true,
    },
    {
      title: 'Wallet',
      navigate: `/$/${PAGES.WALLET}`,
      icon: ICONS.WALLET,
      hideForUnauth: true,
    },
    {
      title: 'Notifications',
      navigate: `/$/${PAGES.NOTIFICATIONS}`,
      icon: ICONS.NOTIFICATION,
      extra: <NotificationBubble inline />,
      hideForUnauth: true,
    },
    {
      title: 'Rewards',
      navigate: `/$/${PAGES.REWARDS}`,
      icon: ICONS.REWARDS,
      hideForUnauth: true,
    },
    {
      title: 'Invites',
      navigate: `/$/${PAGES.INVITE}`,
      icon: ICONS.INVITE,
      hideForUnauth: true,
    },
    {
      title: 'Settings',
      navigate: `/$/${PAGES.SETTINGS}`,
      icon: ICONS.SETTINGS,
      hideForUnauth: true,
    },
    {
      title: 'Help',
      navigate: `/$/${PAGES.HELP}`,
      icon: ICONS.HELP,
      hideForUnauth: true,
    },
    {
      title: 'Sign Out',
      onClick: doSignOut,
      icon: ICONS.SIGN_OUT,
      hideForUnauth: true,
    },
  ];

  const UNAUTH_LINKS: Array<{
    title: string,
    navigate: string,
    icon: string,
    extra?: Node,
    hideForUnauth?: boolean,
  }> = [
    {
      title: 'Log In',
      navigate: `/$/${PAGES.AUTH_SIGNIN}`,
      icon: ICONS.SIGN_IN,
    },
    {
      title: 'Sign Up',
      navigate: `/$/${PAGES.AUTH}`,
      icon: ICONS.SIGN_UP,
    },
    {
      title: 'Settings',
      navigate: `/$/${PAGES.SETTINGS}`,
      icon: ICONS.SETTINGS,
    },
    {
      title: 'Help',
      navigate: `/$/${PAGES.HELP}`,
      icon: ICONS.HELP,
    },
  ];

  const notificationsEnabled = user && user.experimental_ui;
  const isAuthenticated = Boolean(email);
  const [pulseLibrary, setPulseLibrary] = React.useState(false);
  const isPersonalized = !IS_WEB || isAuthenticated;
  const isAbsolute = isOnFilePage || isMediumScreen;
  const microNavigation = !sidebarOpen || isMediumScreen;
  const subLinks = email
    ? ABSOLUTE_LINKS.filter(link => {
        if (!notificationsEnabled && link.icon === ICONS.NOTIFICATION) {
          return false;
        }

        return true;
      })
    : UNAUTH_LINKS;

  React.useEffect(() => {
    if (purchaseSuccess) {
      setPulseLibrary(true);

      let timeout = setTimeout(() => {
        setPulseLibrary(false);
        doClearPurchasedUriSuccess();
      }, 2500);

      return () => clearTimeout(timeout);
    }
  }, [setPulseLibrary, purchaseSuccess, doClearPurchasedUriSuccess]);

  React.useEffect(() => {
    function handleKeydown(e: SyntheticKeyboardEvent<*>) {
      if (e.keyCode === ESCAPE_KEY_CODE && isAbsolute) {
        setSidebarOpen(false);
      } else if (e.keyCode === BACKSLASH_KEY_CODE) {
        const hasActiveInput = document.querySelector('input:focus');
        if (!hasActiveInput) {
          setSidebarOpen(!sidebarOpen);
        }
      }
    }

    window.addEventListener('keydown', handleKeydown);

    return () => window.removeEventListener('keydown', handleKeydown);
  }, [sidebarOpen, setSidebarOpen, isAbsolute]);

  const helpLinks = (
    <ul className="navigation__tertiary navigation-links--small">
      <li className="navigation-link">
        <Button label={__('About')} href="https://lbry.com/about" />
      </li>
      <li className="navigation-link">
        <Button label={__('FAQ')} href="https://odysee.com/@OdyseeHelp:b" />
      </li>
      <li className="navigation-link">
        <Button label={__('Support')} href="https://lbry.com/support" />
      </li>
      <li className="navigation-link">
        <Button label={__('Terms')} href="https://lbry.com/tos" />
      </li>
      <li className="navigation-link">
        <Button label={__('Privacy Policy')} href="https://lbry.com/privacy" />
      </li>
    </ul>
  );

  return (
    <div
      className={classnames('navigation__wrapper', {
        'navigation__wrapper--micro': microNavigation && !isOnFilePage,
        'navigation__wrapper--absolute': isAbsolute,
      })}
    >
      {!isOnFilePage && (
        <nav
          className={classnames('navigation', {
            'navigation--micro': microNavigation,
            // @if TARGET='app'
            'navigation--mac': IS_MAC,
            // @endif
          })}
        >
          <div>
            <ul className={classnames('navigation-links', { 'navigation-links--micro': !sidebarOpen })}>
              {ODYSEE_LINKS.map(linkProps => {
                //   $FlowFixMe
                const { hideForUnauth, ...passedProps } = linkProps;
                return !email && linkProps.hideForUnauth && IS_WEB ? null : (
                  <li key={linkProps.icon}>
                    <Button
                      {...passedProps}
                      label={__(linkProps.title)}
                      //   $FlowFixMe
                      navigate={linkProps.route || linkProps.link}
                      icon={pulseLibrary && linkProps.icon === ICONS.LIBRARY ? ICONS.PURCHASED : linkProps.icon}
                      className={classnames('navigation-link', {
                        'navigation-link--pulse': linkProps.icon === ICONS.LIBRARY && pulseLibrary,
                        'navigation-link--highlighted': linkProps.icon === ICONS.NOTIFICATION && unreadCount > 0,
                      })}
                      activeClass="navigation-link--active"
                    />
                    {linkProps.extra && linkProps.extra}
                  </li>
                );
              })}
            </ul>

            {sidebarOpen && isPersonalized && subscriptions && subscriptions.length > 0 && (
              <ul className="navigation__secondary navigation-links">
                {subscriptions.map(({ uri, channelName }, index) => (
                  <li key={uri} className="navigation-link__wrapper">
                    <Button
                      navigate={uri}
                      label={channelName}
                      className="navigation-link"
                      activeClass="navigation-link--active"
                    />
                  </li>
                ))}
              </ul>
            )}
            {sidebarOpen && isPersonalized && followedTags && followedTags.length > 0 && (
              <ul className="navigation__secondary navigation-links navigation-links--small">
                {followedTags.map(({ name }, key) => (
                  <li key={name} className="navigation-link__wrapper">
                    <Button navigate={`/$/discover?t=${name}`} label={`#${name}`} className="navigation-link" />
                  </li>
                ))}
              </ul>
            )}
          </div>
          {sidebarOpen && helpLinks}
        </nav>
      )}

      {(isOnFilePage || isMediumScreen) && sidebarOpen && (
        <>
          <nav
            className={classnames('navigation--absolute', {
              // @if TARGET='app'
              'navigation--mac': IS_MAC,
              // @endif
            })}
          >
            <div>
              <ul className="navigation-links--absolute">
                {ODYSEE_LINKS.map(linkProps => {
                  //   $FlowFixMe
                  const { hideForUnauth, ...passedProps } = linkProps;
                  return !email && linkProps.hideForUnauth && IS_WEB ? null : (
                    <li key={linkProps.icon}>
                      <Button
                        {...passedProps}
                        label={__(linkProps.title)}
                        icon={pulseLibrary && linkProps.icon === ICONS.LIBRARY ? ICONS.PURCHASED : linkProps.icon}
                        className={classnames('navigation-link', {
                          'navigation-link--pulse': linkProps.icon === ICONS.LIBRARY && pulseLibrary,
                          'navigation-link--highlighted': linkProps.icon === ICONS.NOTIFICATION && unreadCount > 0,
                        })}
                        activeClass="navigation-link--active"
                      />
                      {linkProps.extra && linkProps.extra}
                    </li>
                  );
                })}
              </ul>
              <ul className="navigation-links--absolute mobile-only">
                {subLinks.map(linkProps => {
                  const { hideForUnauth, ...passedProps } = linkProps;

                  return !email && hideForUnauth && IS_WEB ? null : (
                    <li key={linkProps.icon}>
                      <Button
                        {...passedProps}
                        label={__(linkProps.title)}
                        className="navigation-link"
                        activeClass="navigation-link--active"
                      />
                      {linkProps.extra}
                    </li>
                  );
                })}
              </ul>
              {sidebarOpen && isPersonalized && subscriptions && subscriptions.length > 0 && (
                <ul className="navigation__secondary navigation-links">
                  {subscriptions.map(({ uri, channelName }, index) => (
                    <li key={uri} className="navigation-link__wrapper">
                      <Button
                        navigate={uri}
                        label={channelName}
                        className="navigation-link"
                        activeClass="navigation-link--active"
                      />
                    </li>
                  ))}
                </ul>
              )}
              {sidebarOpen && isPersonalized && followedTags && followedTags.length > 0 && (
                <ul className="navigation__secondary navigation-links navigation-links--small">
                  {followedTags.map(({ name }, key) => (
                    <li key={name} className="navigation-link__wrapper">
                      <Button navigate={`/$/discover?t=${name}`} label={`#${name}`} className="navigation-link" />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {helpLinks}
          </nav>
          <div
            className={classnames('navigation__overlay', {
              // @if TARGET='app'
              'navigation__overlay--mac': IS_MAC,
              // @endif
            })}
            onClick={() => setSidebarOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export default SideNavigation;
