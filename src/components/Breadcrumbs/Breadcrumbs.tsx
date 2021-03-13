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
        <Breadcrumb.Item>
          <Link href={`/`}>Home</Link>
        </Breadcrumb.Item>

        {breadcrumbs.map((breadcrumb, index) => {
          return (
            <Breadcrumb.Item key={index}>
              <Link key={breadcrumb.href} href={breadcrumb.href} passHref>
                {convertBreadcrumb(breadcrumb.breadcrumb)}
              </Link>
            </Breadcrumb.Item>
          )
        })}
      </Breadcrumb>
    </nav>
  )
}

export default Breadcrumbs
