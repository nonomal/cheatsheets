import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import { Spinner } from 'styled-cssgg'
import { animated, useTrail } from 'react-spring'

import { Github } from '~/interface/github'
import Layout from '~/components/Layout'
import { Meta } from '~/components/Meta'
import { Sheet } from '~/components/Sheet'
import { useRouter } from 'next/router'
import { useSearchIssue } from '~/hooks/use-search-issue'

const Content = ({
  issues = [],
  status,
  highlight,
}: {
  issues?: Github.Issue[]
  status?: Github.Status
  highlight?: string
}) => {
  const transitions = useTrail<{ opacity: number }>(issues.length, {
    opacity: status === 'loading' ? 0 : 1,
    from: { opacity: 0 },
  })
  if (status === 'loading') {
    return <Spinner />
  }
  return (
    <div className="w-full p-12 box-border">
      {issues && issues.length !== 0 ? (
        <>
          {transitions.map((props, index) => {
            return (
              <animated.div key={issues[index].id} className="mb-4 w-full float-left" style={props}>
                <Sheet highlight={highlight} v={issues[index]} />
              </animated.div>
            )
          })}
        </>
      ) : null}
    </div>
  )
}

const IndexPage: NextPage<{ data: Github.Label[] }> = props => {
  const defaultKeyword = useRouter().query.q as string
  const { data: issues, status } = useSearchIssue({ defaultKeyword })
  return (
    <Layout>
      <Meta />
      <Content highlight={defaultKeyword} issues={issues} status={status} />
    </Layout>
  )
}

export async function getServerSideProps(_ctx: Parameters<GetServerSideProps>[0]) {
  // const data = await api.github.labels()
  return { props: { data: [] } }
}

export default IndexPage
