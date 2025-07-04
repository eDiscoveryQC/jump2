import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Head from "next/head";
import AppLayout from "@/components/AppLayout";
import Jump2Card from "@/components/Jump2Card";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #facc15;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #cbd5e1;
  margin-bottom: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const SearchInput = styled.input`
  padding: 0.7rem 1rem;
  font-size: 1rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  color: white;
  width: 100%;
  max-width: 400px;
  margin-bottom: 1rem;

  &::placeholder {
    color: #94a3b8;
  }
`;

const EmptyState = styled.div`
  margin-top: 4rem;
  text-align: center;
  color: #64748b;
  font-size: 1.1rem;
`;

const NewShareButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #facc15;
  color: #0f172a;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.9rem 1.4rem;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  z-index: 50;

  &:hover {
    background: #fde047;
  }
`;

function relativeDate(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return past.toLocaleDateString();
}

export default function Dashboard() {
  const [shares, setShares] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        toast.error("Failed to load shares.");
      } else {
        setShares(data || []);
      }
    }
    loadData();
  }, []);

  const filtered = shares.filter((item) =>
    (item.title || item.url)
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const handleDelete = async (id: string) => {
    const original = [...shares];
    setShares(shares.filter((s) => s.id !== id));
    toast("Share deleted", {
      icon: "🗑️",
      action: {
        text: "Undo",
        onClick: () => setShares(original),
      },
    });

    await supabase.from("links").delete().eq("id", id);
  };

  return (
    <AppLayout>
      <Head>
        <title>Jump2 – Dashboard</title>
      </Head>

      <Title>Your Shares</Title>
      <Subtitle>All your shared links and highlights in one place.</Subtitle>

      <SearchInput
        placeholder="Search by URL, title, or domain..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <EmptyState>
          🦄 No shares found. <br />
          <br />
          Start by <a href="/share" style={{ color: "#facc15" }}>creating one</a>.
        </EmptyState>
      ) : (
        <Grid>
          {filtered.map((share) => (
            <Jump2Card
              key={share.id}
              title={share.title || share.url}
              domain={new URL(share.url).hostname}
              url={`https://jump2.link/${share.code}`}
              createdAt={relativeDate(share.created_at)}
              onCopy={() => {
                navigator.clipboard.writeText(`https://jump2.link/${share.code}`);
                toast.success("Link copied!");
              }}
              onDelete={() => handleDelete(share.id)}
            />
          ))}
        </Grid>
      )}

      <NewShareButton onClick={() => (window.location.href = "/share")}>
        + New Share
      </NewShareButton>
    </AppLayout>
  );
}
