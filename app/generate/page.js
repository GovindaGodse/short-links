"use client";

import { useState } from "react";
import { preload } from "react-dom";
import Image from "next/image";

export default function Generate() {
  preload("/loading-scissor.svg", { as: "image" });
  preload("/copied.svg", { as: "image" });
  const [url, setUrl] = useState("");
  const [generatedShortURL, setGeneratedShortURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const isValidUrl = (value) => {
    try {
      const parsedUrl = new URL(value.trim());
      return (
        ["http:", "https:"].includes(parsedUrl.protocol) &&
        Boolean(parsedUrl.hostname)
      );
    } catch {
      return false;
    }
  };

  const generate = async (event) => {
    event.preventDefault();
    if (!isValidUrl(url) || isLoading) return;

    setIsLoading(true);
    setError("");
    setGeneratedShortURL("");
    setCopied(false);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (!response.ok)
        throw new Error("We couldn't create your link. Please try again.");
      const result = await response.json();
      if (!result.shortUrl)
        throw new Error(
          "The server didn't return a short link. Please try again.",
        );
      setGeneratedShortURL(result.shortUrl);
      setUrl("");
    } catch (requestError) {
      setError(
        requestError.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyLink = async () => {
    const fullUrl = `${window.location.origin}/${generatedShortURL}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Couldn't access your clipboard. Select the link to copy it.");
    }
  };

  return (
    <main className="generate-main">
      <section className="generator">
        <header className="generator-heading">
          <span className="eyebrow">The quick link maker</span>
          <h1 className="generator-title">Shorten a link</h1>
          <p className="generator-description">
            Paste a long URL below. We’ll make it short, neat, and ready to
            share.
          </p>
        </header>

        <form className="generator-card" onSubmit={generate}>
          <label className="input-label" htmlFor="urlInput">
            Long URL
          </label>
          <div className="input-row">
            <input
              value={url}
              type="url"
              name="urlInput"
              id="urlInput"
              className="url-input"
              placeholder="https://example.com/your-very-long-link"
              onChange={(event) => {
                setUrl(event.target.value);
                if (error) setError("");
              }}
              autoComplete="url"
              required
            />
            <button
              className="generate-button"
              type="submit"
              disabled={!isValidUrl(url) || isLoading}
              aria-label={isLoading ? "Generating short link" : "Shorten link"}
            >
              <Image
                src={isLoading ? "/loading-scissor.svg" : "/scissor.svg"}
                alt=""
                width={18}
                height={18}
                aria-hidden="true"
              />
            </button>
          </div>
          <p className="generator-hint">
            Include https:// at the beginning of your URL.
          </p>

          <div
            className={`result-expander${generatedShortURL ? " is-open" : ""}`}
          >
            <div className="result-expander-inner">
              {generatedShortURL && (
                <div className="result-card">
                  <div>
                    <p className="result-info">Your short link is ready</p>
                    <a className="result-link" href={`/${generatedShortURL}`}>
                      {`${window?.location.origin}/${generatedShortURL}`}
                    </a>
                  </div>
                  <button
                    className="copy-button"
                    type="button"
                    onClick={copyLink}
                    aria-label={copied ? "Copied" : "Copy link"}
                  >
                    <Image
                      src={copied ? "/copied.svg" : "/copy.svg"}
                      alt=""
                      width={18}
                      height={18}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
        </form>
        <p className="privacy-note">
          <span className="text-base font-extralight">*</span> No account
          needed. Your link is ready in seconds.
        </p>
      </section>
    </main>
  );
}
