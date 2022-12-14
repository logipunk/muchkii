import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
//import { Props } from 'wagmi/dist/declarations/src/context'
import { sanityClient, urlFor } from '../sanity'
import { Collection } from '../typings'
import Link from 'next/link';
import * as Scroll from 'react-scroll';
import { Button, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'



interface Props{
  collections: Collection[]
}

const Home = ({collections}:Props) => {
  return (
  <div className=' max-w-6xl mx-auto flex flex-col min-h-screen py-20 px-10'>  
    <Head>
        <title>MUCHKII NFTs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

     <div className="vimeo-wrapper contrast-20">  
  <iframe  src="https://player.vimeo.com/video/230160738?background=1&autoplay=1&loop=1&byline=0&title=0"
           frameBorder="0"    ></iframe>
 {/* webkitallowfullscreen mozallowfullscreen allowfullscreen*/}
    </div> 
  <div className='flex flex-col items-end'>
  <h1 className="mb-1 text-2xl font-extralight text-slate-300 m-5">
    
        <a href='#About'>About</a> </h1>
   
  </div> 
<hr className='my-2 border bg-slate-300 mb-10' />
  <main className='bg-slate-100/70 p-10 shadow-2xl shadow-black rounded-2xl'>
    <div className='grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
      {collections.map(collection => (
        <Link   href={`/nft/${collection.slug.current}`}>
        <div className='flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105'>
          <img className='h-96 w-60 rounded-2xl object-cover' src={urlFor(collection.mainImage).url()} alt=""/>
          <div className='p-5'>
            <h2 className='text-3xl'>{collection.title}</h2>
            <p className='mt-2 text-sm text-gray-500'>{collection.description}</p>
          </div>
        </div>
        </Link>
      ))}
      </div>
  </main>

  <div className='bg-slate-100/70 p-10 shadow-2xl shadow-black rounded-2xl flex mt-60 scroll-smooth' id='About'>
     <img className='rounded-2xl object-cover m-3' src={urlFor(collections[0].creator.image).url()} alt=""/> 
        <p> {collections[0].creator.bio}</p>  
        
        
  </div>
   

</div>







  )
}

export default Home

//this is used for server side rendering
export const getServerSideProps:GetServerSideProps= async () => {
 
  const query=`*[_type =="collection"]{
    _id,
    title,
    contractAddr,
    nftCollectionName,
    description,
    mainImage{
         asset
    },
    previewImage{
      asset
    },
    slug{
      current
    },
    creator->{
      _id,
      name,
      address,
      image,
      bio,
      slug{
        current
    }
    }
  }`

  const collections = await sanityClient.fetch(query)
  console.log("Collections"+collections)

  return {
    props: {
      collections
    }
  }
}