import type { Metadata } from "next";
import Page from "@/app/page";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "SmartLight-APP",
  description: "App for managing your LSC smart light",
    manifest: "/manifest.json",
};

export default function RootLayout({children}:
{
    children: React.ReactNode
}) {
    return (
        <html lang="fr" data-theme="dark">
        <head>
            <link rel="manifest" href="/manifest.json"/>

            <meta name="apple-mobile-web-app-capable" content="yes"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
            <meta name="apple-mobile-web-app-title" content="SmartLight"/>
        </head>
        <body>{children}</body>
        </html>
    )
}