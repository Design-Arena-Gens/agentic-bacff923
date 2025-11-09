"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";

type Palette = { name: string; a: string; b: string };

const PALETTES: Palette[] = [
  { name: "???? / ????", a: "#3b82f6", b: "#22c55e" },
  { name: "?????? / ????", a: "#8b5cf6", b: "#ec4899" },
  { name: "??????? / ????", a: "#f97316", b: "#eab308" },
  { name: "????? / ????", a: "#06b6d4", b: "#3b82f6" },
  { name: "???? / ???????", a: "#16a34a", b: "#10b981" }
];

export default function PostDesigner() {
  const [title, setTitle] = useState("????? ???? ?????? ?????");
  const [subtitle, setSubtitle] = useState("???? ????? ???????? ???????? ????? ????? ?????.");
  const [cta, setCta] = useState("???? ????");
  const [phone, setPhone] = useState("+966 55 123 4567");
  const [website, setWebsite] = useState("example.com");
  const [badge, setBadge] = useState("????? ????? ????");
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const palette = useMemo(() => PALETTES[paletteIdx], [paletteIdx]);

  const onPickLogo = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoUrl(url);
  }, []);

  const exportPng = useCallback(async () => {
    if (!nodeRef.current) return;
    // Temporarily set CSS variables to palette for export
    nodeRef.current.style.setProperty("--accent", palette.a);
    nodeRef.current.style.setProperty("--accent-2", palette.b);

    const dataUrl = await htmlToImage.toPng(nodeRef.current, {
      cacheBust: true,
      pixelRatio: 1,
      backgroundColor: "#0a0f1a"
    });
    const link = document.createElement("a");
    link.download = `post-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, [palette]);

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="brand-badge">AD</div>
          <div>
            <div className="brand-title">???? ???? ???????</div>
            <div className="hint">???? ?????? ??????? ??????????</div>
          </div>
        </div>
        <div className="row">
          <button className="btn" onClick={exportPng}>????? ????? PNG</button>
          <a className="btn secondary" href="#preview">??????</a>
        </div>
      </header>

      <main className="main">
        <section className="panel">
          <h2>?????????</h2>

          <div className="field">
            <label>??????</label>
            <input className="input" value={badge} onChange={e=>setBadge(e.target.value)} placeholder="?? ???? ???? ???? ???????" />
          </div>

          <div className="field">
            <label>??????? ???????</label>
            <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="???? ??????? ?????" />
          </div>

          <div className="field">
            <label>??? ?????</label>
            <textarea className="input" value={subtitle} onChange={e=>setSubtitle(e.target.value)} rows={3} placeholder="??? ???? ??????" />
          </div>

          <div className="row">
            <div className="field">
              <label>?? ?????? ???????</label>
              <input className="input" value={cta} onChange={e=>setCta(e.target.value)} placeholder="????: ????? ????" />
            </div>
            <div className="field">
              <label>??? ??????</label>
              <input className="input" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="????: +966 .." />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>??????</label>
              <input className="input" value={website} onChange={e=>setWebsite(e.target.value)} placeholder="example.com" />
            </div>
            <div className="field">
              <label>???? ??????</label>
              <input className="file" type="file" accept="image/*" onChange={onPickLogo} />
            </div>
          </div>

          <div className="field">
            <label>???????</label>
            <div className="palette">
              {PALETTES.map((p, i) => (
                <button
                  key={p.name}
                  type="button"
                  title={p.name}
                  className={`swatch ${i===paletteIdx? 'active':''}`}
                  style={{ background: `linear-gradient(135deg, ${p.a}, ${p.b})` }}
                  onClick={()=>setPaletteIdx(i)}
                />
              ))}
            </div>
            <div className="hint">???? ?????? ?????? ???? ???? ??????</div>
          </div>

        </section>

        <section id="preview" className="preview-wrap">
          <div className="panel">
            <h2>???????? 1080?1080</h2>
            <div className="canvas-wrap">
              <div ref={nodeRef} className="post" style={{ ['--accent' as any]: palette.a, ['--accent-2' as any]: palette.b }}>
                <div className="shape-a"/>
                <div className="shape-b"/>
                <div className="shape-c"/>
                <div className="post-inner">
                  <div>
                    <div className="badge"><span className="dot"/> {badge}</div>
                    <h1 className="title">{title}</h1>
                    <p className="subtitle">{subtitle}</p>
                    <div className="cta">
                      <div className="left">
                        <button className="btn-cta">{cta}</button>
                        <span className="hint">????: {phone}</span>
                      </div>
                      <span className="hint">{website}</span>
                    </div>
                  </div>
                  <div className="footer-bar">
                    <div className="watermark">???? ?????? ?????? ?????????</div>
                    <div className="logo">
                      {logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Z" stroke="#2b3a55" strokeWidth="2"/>
                          <path d="M7 16l3-3 3 3 4-4 3 3" stroke="#3b82f6" strokeWidth="2"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <button className="btn" onClick={exportPng}>????? ??????? ?????</button>
            <button className="btn secondary" onClick={()=>window.scrollTo({ top: 0, behavior: 'smooth' })}>?????? ???????</button>
          </div>
        </section>
      </main>
    </div>
  );
}
