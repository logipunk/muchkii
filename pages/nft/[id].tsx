import React from 'react'
import HomeIMG from 'vids/home.jpg'
import { ConnectWallet, useAddress } from "@thirdweb-dev/react"
import Link from 'next/link';
import type { GetServerSideProps, NextPage } from 'next'
import {sanityClient,urlFor} from '../../sanity'
import { Collection } from '../../typings'



// export const NFTWalletSetup = () => {
//     const address = useAddress();
    
//   };

interface Props{
    collection: Collection
}

function NFTDropPage({collection}: Props)
{
  

    //Wallet setup
    const wallet_address = useAddress();


return (
<div className='flex flex-1 flex-col p-12'>
 {/* Header  */}
    <header className='flex items-center justify-end'>
        {/* <h1 className=' text-xl font-extralight sm:w-80'>MUCHKII Gallery View</h1> */}
        <h1 className=' justify-end p-4 cursor-pointer'>
            <Link href={'/'}>
            <img src={HomeIMG.src} alt="home" className='w-14'/>
            </Link>
        </h1>

        {/* <button>Connect your wallet.</button> */}
        <div>
        <ConnectWallet />
      </div>
    </header>
    <hr className='my-2 border'/>
    <div className='flex flex-col items-center'>
        <h1 className='text-2xl font-bold font-mono'>{collection.title}</h1>
        <h2 className='text-light font-bold font-mono'>{collection.description}</h2>
    </div>


 {/* NFTs grid view 
  <div className="flex-col grid grid-flow-col gap-4">  */}
    <div className="flex flex-1 items-center py-5 px-10 lg:min-h-screen flex-wrap gap-4 mt-10"> 
        <div className=" rounded-xl p-2 bg-slate-500">
            02 <img className='w-44 rounded-xl object-cover lg:h-96 lg:w-72' src="https://cdn2.benzinga.com/files/imagecache/og_image_social_share_1200x630/images/story/2012/d.jpg?width=720"/>
        <button className='h-10 bg-orange-500 font-bold p-2 text-white rounded-full 
                           mt-2 shadow-md shadow-orange-500/50 hover:shadow-slate-400'>Mint NFT</button>
        </div>
        <div className=" rounded-xl p-2 bg-slate-500">
            03 <img className='w-44 rounded-xl object-cover lg:h-96 lg:w-72' src="https://cdn2.benzinga.com/files/imagecache/og_image_social_share_1200x630/images/story/2012/d.jpg?width=720"/>
        </div>
        <div className=" rounded-xl p-2 bg-slate-500">
            04 <img className='w-44 rounded-xl object-cover lg:h-96 lg:w-72' src="https://cdn2.benzinga.com/files/imagecache/og_image_social_share_1200x630/images/story/2012/d.jpg?width=720"/>
        </div>
        <div className=" rounded-xl p-2 bg-slate-500">
            05 <img className='w-44 rounded-xl object-cover lg:h-96 lg:w-72' src="https://cdn2.benzinga.com/files/imagecache/og_image_social_share_1200x630/images/story/2012/d.jpg?width=720"/>
        </div>
        <div className=" rounded-xl p-2 bg-slate-500">
            06 <img className='w-44 rounded-xl object-cover lg:h-96 lg:w-72' src="https://cdn2.benzinga.com/files/imagecache/og_image_social_share_1200x630/images/story/2012/d.jpg?width=720"/>
        </div>
    </div>

</div>

  )
}

export default NFTDropPage

export const getServerSideProps:GetServerSideProps= async ({params}) => {
    const query = `*[_type =="collection" && slug.current == $id][0]{
        _id,
        title,
        smartcontractaddress,
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
          slug{
            current
        }
        }
      }`

      const collection = await sanityClient.fetch(query,{
        id: params?.id
      })

      if(!collection){
        return {
            notFound: true
        }
      }
      return{
        props: { 
          collection
        }
      }

}
