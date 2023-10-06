import { NextPage } from 'next'
import Image from 'next/image'
import Router from 'next/router'
import Layout from '@/components/Layout'

const Site = () => {
  console.log(Router.route)

  return (
    <main>
      <Layout>
        <div className="w-full">
            <Image
              className="md:w-auto w-5/6 mb-5 object-cover rounded-full"
              alt="hero"
              width={800}
              height={50}
              src={"/hero.png"}
            />
      </div>
      </Layout>
    </main>
  )
}

export default Site