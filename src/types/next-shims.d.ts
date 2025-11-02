declare module 'next/head' {
  const Head: any
  export default Head
}

declare module 'next/link' {
  import React from 'react'
  const Link: React.FC<any>
  export default Link
}

declare module 'next/router' {
  export function useRouter(): { query: any }
}

declare module 'next/document' {
  import React from 'react'
  export class Document extends React.Component<any, any> {
    render(): React.ReactNode
  }
  export const Html: React.FC<any>
  export const Head: React.FC<any>
  export const Main: React.FC<any>
  export const NextScript: React.FC<any>
}
