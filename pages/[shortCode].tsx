import { GetServerSideProps } from 'next';
import { supabase } from '../lib/supabase';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { shortCode } = context.params!;

  const { data, error } = await supabase
    .from('short_links')
    .select('deep_link')
    .eq('short_code', shortCode)
    .single();

  if (error || !data) {
    return {
      notFound: true,
    };
  }

  return {
    redirect: {
      destination: data.deep_link,
      permanent: false,
    },
  };
};

export default function RedirectPage() {
  return null; // This page never renders because of redirect
}
