// pages/dashboard.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import { FaSearch, FaPlus } from "react-icons/fa";
import AppLayout from "@/components/AppLayout";
import Jump2Card from "@/components/Jump2Card";
import { supabase } from "@/lib/supabase";

const PageWrapper = styled.div`
  max-width: 1080px;
  margin: 0 auto;
`;

const TitleBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #facc15;
  }
`;

const SearchInput = styled.input`
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  width: 100%;
  max-width: 360px;
  background: #1e293b;
  color: white;
  border: 1px solid #334155;

  &::placeholder {
    color: #94a3b8;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`;

const FloatingAction = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 100px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  z-index: 20;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #0284c7;
  }
`;

interface LinkItem {
  id: number;
  code: string;
  url: string;
  created_at: string;
}

export default function Dashboard() {
  const [shares, setShares] = useState<LinkItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchLinks() {
      const { data, error } = await supabase
        .from("links")
        .select("id, code, url, created_at")
        .order("created_at", { ascending: false });
      if (data) setShares(data);
      if (error) console.error(error);
    }
    fetchLinks();
  }, []);

  const filtered = shares.filter((link) =>
    link.url.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    const original = [...shares];
    const updated = shares.filter((s) => s.id !== id);
    setShares(updated);

    toast.custom((t) => (
      <div
        style={{
          background: "#1e293b",
          color: "white",
          padding: "1rem 1.5rem",
          borderRadius: "0.5rem",
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <span>🗑️ Share deleted</span>
        <button
          style={{
            background: "#16a34a",
            border: "none",
            borderRadius: "0.25rem",
            padding: "0.4rem 0.8rem",
            cursor: "pointer",
            fontWeight: 600,
          }}
          onClick={() => {
            setShares(original);
            toast.dismiss(t.id);
          }}
        >
          Undo
        </button>
      </div>
    ));
  };

  return (
    <AppLayout>
      <Head>
        <title>Jump2 Dashboard</title>
      </Head>
      <Toaster position="top-right" />

      <PageWrapper>
        <TitleBar>
          <h1>📊 Your Shares</h1>
          <SearchInput
            type="text"
            placeholder="Search shared links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </TitleBar>

        <Grid>
          {filtered.map((item) => (
            <Jump2Card key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </Grid>
      </PageWrapper>

      <FloatingAction onClick={() => (window.location.href = "/share")}> 
        <FaPlus /> New Share
      </FloatingAction>
    </AppLayout>
  );
}
