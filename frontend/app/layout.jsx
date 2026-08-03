import './global.css'
export const metadata = {
  robots:{
    index:false,
    follow:false
  }
}

export default function Layout ({children}) {
   return (
    <html>
      <body>
        {children}
      </body>
    </html>
   )
}