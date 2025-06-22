import { GetServerSideProps } from 'next';
import React from 'react';
import { supabase } from '../../lib/supabase';

// --- SSR for Jump2: Competitive, fragment-safe redirect ---
export const getServerSideProps: GetServerSideProps = async (context) => {
  const shortCode = context.params?.id as string;

  if (!shortCode) {
    return { notFound: true };
  }

  const { data, error } = await supabase
    .from('short_links')
    .select('deep_link')
    .eq('short_code', shortCode)
    .single();

  if (error || !data) {
    return { notFound: true };
  }

  // Detect if the deep_link has a fragment/hash
  let hasFragment = false;
  try {
    const urlObj = new URL(data.deep_link);
    hasFragment = !!urlObj.hash;
  } catch {
    hasFragment = data.deep_link.includes('#');
  }

  // If no fragment, server redirect is safe and optimal
  if (!hasFragment) {
    return {
      redirect: {
        destination: data.deep_link,
        permanent: false,
      },
    };
  }

  // Otherwise, client-side redirect to preserve fragment for browsers
  return {
    props: {
      deepLink: data.deep_link,
    },
  };
};

interface RedirectProps {
  deepLink?: string;
}

/**
 * Client-side redirect when there is a fragment in the link.
 * Ensures :~:text highlight works for browsers like Chrome/Edge.
 * If redirect fails, shows a fallback clickable link.
 */
export default function Redirect({ deepLink }: RedirectProps) {
  React.useEffect(() => {
    if (deepLink) {
      setTimeout(() => {
        window.location.replace(deepLink);
      }, 100); // short delay for UX/paint
    }
  }, [deepLink]);

  return (
    <div style={{
      fontFamily: "sans-serif",
      textAlign: "center",
      marginTop: "5em",
      fontSize: "1.2em",
      color: "#2563eb"
    }}>
      {deepLink ? (
        <>
          <div>Redirecting…</div>
          <div style={{fontSize:"0.8em",marginTop:"2em"}}>
            If you are not redirected, <a href={deepLink}>click here</a>.
          </div>
        </>
      ) : (
        "Invalid or expired Jump2 link."
      )}
    </div>
  );
}