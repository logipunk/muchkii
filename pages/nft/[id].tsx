import React, { useEffect, useState }  from 'react'
import HomeIMG from 'vids/home.jpg'
import { ConnectWallet, 
        useAddress, 
        useContract, 
        useContractRead,
        useNFTs,
        ThirdwebNftMedia,
        useNFT, 
        useUnclaimedNFTs, 
        useClaimConditions,
        useMintNFT } from "@thirdweb-dev/react"
import Link from 'next/link';
import type { GetServerSideProps, NextPage } from 'next'
import {sanityClient,urlFor} from '../../sanity'
import { Collection } from '../../typings'
import { BigNumber, ethers } from 'ethers'

import RModalImage from 'react-modal-image'


//const ModalImage = require('react-modal-image')

// export const NFTWalletSetup = () => {
//     const address = useAddress();
    
//   };

interface Props{
    collection: Collection
}

function NFTDropPage({collection}: Props)
{
  
    const [claimedSupply, setClaimedSupply] = useState<number>(0); //wywal
    const [totalSupply, setTotalSupply] = useState<BigNumber>();//wywal
    const [contractAddress, setContractAddress] = useState<string>();//wywal
    const [priceInETH, setPriceInETH] = useState<string>();
    const [loading, setLoading] = useState<boolean>(true);
    


    //loading contract 
   
    const {contract} = useContract(collection.contractAddr)

    //getting NFT metadata
    const { data: nfts, isLoading: isLoadingNfts } = useNFTs(contract);
    
    //getting NFT claim conditions
    const { data: claimCondition  } = useClaimConditions(contract)

    

    //use to mint NFTs
    const {mutate: mintMyNFT} = useMintNFT(contract)
    
    useEffect(() => {
        if(!contract) return;

        const fetchNFTData = async () => {
            setLoading(true);

            const contractAddress = await contract.getAddress();
            setContractAddress(contractAddress);

            setLoading(false);
        }
        fetchNFTData();
    },[contract])

    //Wallet setup
    const wallet_address = useAddress();

 //minting
 const mintNFT = (id: string) =>{
        if(!wallet_address) return

        
       
            console.log("minting biatches NFTs..." +id )
        
            mintMyNFT.arguments

        //   contract?.erc721.mint({
        //   tokenId: id,
            
        //  }).catch(err => {console.log(err)})
        //  .finally(()=>{})
 }  



 


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

        <div className='flex flex-col items-center p-10'>
            {isLoadingNfts ?(
                <p className=' animate-pulse text-2xl font-bold font-mono'>Loading Gallery</p>
            ):(
                
            <main>
                <div>
                
                </div>
                <div className='grid  md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
                    {nfts?.map((nft)=>(
                        <div className='flex flex-col items-center rounded-xl p-1 bg-slate-500/20 shadow-slate-600 shadow-2xl cursor-pointer '>
                             <RModalImage className='h-96 w-60 rounded-2xl object-cover' hideDownload='true'
                              small={nft.metadata.image?.toString()}
                              large={nft.metadata.image?.toString()}/> 
                            <div className='p-5'>
                            <h2 className='text-3xl'>{nft.metadata.name}</h2>
                            <p className='mt-2 text-sm text-gray-500'>{nft.metadata.description}</p> 
                                {/* this button is for NFT to be minted 
                                1.show if [connected to wallet true , nft.owner = 0x0000000000000000000000000000000000000000]
                                onClick links to Open Sea */}
                            <button onClick={() => mintNFT(nft.metadata.id)} hidden={!wallet_address || nft.owner != '0x0000000000000000000000000000000000000000'} className='h-10 bg-orange-500 font-bold p-2 text-white rounded-full 
                                mt-2 shadow-md shadow-orange-500/50 hover:shadow-slate-400'>Mint NFT ({claimCondition?.[0].currencyMetadata.displayValue} Ξ)</button>
                                {/* this button is for NFT owners
                                1.show if [connected to wallet true , nft.owner = wallet_address]
                                onClick links to Open Sea */}
                            <button hidden={!wallet_address || nft.owner != wallet_address || nft.owner != '0x0000000000000000000000000000000000000000'
                                            } className='h-10 bg-orange-500 font-bold p-2 text-white rounded-full 
                                mt-2 shadow-md shadow-orange-500/50 hover:shadow-slate-400'>Sell NFT ({})</button>
                            {/* this button is for NFT owned by someone else
                                1.show if [connected to wallet true && nft.owner != wallet_address && nft.owner = 0x0000000000000000000000000000000000000000]
                                onClick links to Open Sea */}
                            <button  hidden={ !wallet_address && nft.owner == wallet_address || nft.owner == '0x0000000000000000000000000000000000000000'
                                            } className='h-10 bg-orange-500 font-bold p-2 text-white rounded-full 
                                mt-2 shadow-md shadow-orange-500/50 hover:shadow-slate-400'>Buy or Make Offer</button>
        
                            </div>
                            
                        </div> 
                        
                    ))}
                
                </div>
            </main>
           )}

            {isLoadingNfts && (
              <img className='h-80 w-80 object-contain' src='https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif'/>
            )}
        </div>
        
</div>

  )
}

export default NFTDropPage

export const getServerSideProps:GetServerSideProps= async ({params}) => {
    const query = `*[_type =="collection" && slug.current == $id][0]{
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
