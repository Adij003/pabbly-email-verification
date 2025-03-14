import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/app';

import { Iconify } from 'src/components/iconify';
import CustomTabs from 'src/components/custom-tabs/custom-tabs';

// ----------------------------------------------------------------------
const metadata = { title: `Settings | ${CONFIG.site.name}` };

export default function Page() {
  const EXAMPLE_TABS = [
    {
      value: 'credits',
      path: '/app/settings/credits',
      icon: <Iconify icon="icons8:tasks" width={24} />,
      label: 'Credits Summary',
      tooltip: 'Click to view credit summary.',
      pageTitle: 'Credits Summary',
      pageSubheading: 'View a summary of your email verification credits. ',
      link: 'https://forum.pabbly.com/threads/credits-summary.26312/',
    },
    // {
    //   value: 'api',
    //   path: '/app/settings/api',
    //   icon: <Iconify icon="pajamas:api" width={24} />,
    //   label: 'API',
    //   tooltip: 'Get API key and secret key to perform email verifications directly.',
    //   pageTitle: 'API',
    //   pageSubheading:
    //     'Generate your API Key and Secret Key to perform email verifications directly through the Pabbly Email Verification API. ',
    //   link: 'https://forum.pabbly.com/threads/api.26313/',
    // },
    {
      value: 'team-members',
      path: '/app/settings/team-members',
      icon: <Iconify icon="fluent:people-team-28-filled" width={24} />,
      label: 'Team Members',
      tooltip: 'Add team members and share folder(s) access with them.',
      pageTitle: 'Team Members',
      pageSubheading: 'Add team members and share folder(s) access with them from here. ',
      link: 'https://forum.pabbly.com/threads/team-members.26323/',
    },

    {
      value: 'activity-log',
      path: '/app/settings/activity-log',
      icon: <Iconify icon="material-symbols:work-history" width={24} />,
      label: 'Activity Log',
      tooltip:
        'Activity Log helps you monitor changes and keep track of all actions in your Pabbly Email Verification account.',
      pageTitle: 'Activity Log',
      pageSubheading:
        'Keep track of all actions in your Pabbly Email Verification account, like verifying single emails, uploading and verifying email lists, downloading reports, deleting email lists, adding team members, and regenerating API keys. Activity Log helps you monitor changes and ensure everything runs smoothly. ',
      link: 'https://forum.pabbly.com/threads/activity-log.26108/',
    },
    {
      value: 'timzone',
      path: '/app/settings/timezone',
      icon: <Iconify icon="ri:time-zone-fill" width={24} />,
      label: 'Time Zone',
      tooltip: 'View and manage the time zone settings of your account.',
      pageTitle: 'Time Zone',
      pageSubheading: 'Manage your account time zone settings. ',
      link: 'https://forum.pabbly.com/threads/time-zone.26314/',
    },
  ];
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DashboardContent maxWidth="xl">
        <CustomTabs
          tabs={EXAMPLE_TABS}
          defaultTab="timezone"
          defaultPath="/app/settings/timezone"
          dashboardContentProps={{ maxWidth: 'xl' }}
        />
      </DashboardContent>
    </>
  );
}
