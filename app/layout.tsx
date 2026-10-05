import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata={title:'Roblox Mobile Simulator',description:'Editable mobile simulator'};
export const viewport: Viewport={width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#f2f2f2'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
