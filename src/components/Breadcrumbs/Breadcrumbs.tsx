import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Breadcrumb } from 'antd'

const convertBreadcrumb = (string) => {
  return (
    string.replace(/-/g, ' ').replace(/oe/g, 'ö').replace(/ae/g, 'ä').replace(/ue/g, 'ü').charAt(0).toUpperCase() +
    string.slice(1)
  )
}

const Breadcrumbs = () => {
  const router = useRouter()
  const [breadcrumbs, setBreadcrumbs] = useState(null)

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split('/')
      linkPath.shift()

      const pathArray = linkPath.map((path, i) => {
        return { breadcrumb: path, href: '/' + linkPath.slice(0, i + 1).join('/') }
      })

      setBreadcrumbs(pathArray)
    }
  }, [router])

  if (!breadcrumbs) {
    return null
  }

  return (
    <nav aria-label="breadcrumbs">
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Link href={`/`} passHref prefetch>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Link>
        {breadcrumbs.map((breadcrumb) => {
          return (
            <Link key={breadcrumb.href} href={breadcrumb.href} passHref prefetch>
              <Breadcrumb.Item>{convertBreadcrumb(breadcrumb.breadcrumb)}</Breadcrumb.Item>
            </Link>
          )
        })}
      </Breadcrumb>
    </nav>
  )
}

export default Breadcrumbs
