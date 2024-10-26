'use client'

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProductList } from "@/redux/slices/productSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const dispatch = useAppDispatch()
  const { productListState: { loading, data: cData } } = useAppSelector((state) => state.product)
  console.log('cData', cData)
  useEffect(()=>{
    dispatch(fetchProductList())
  }, [dispatch])

  const router = useRouter();
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-100 dark:bg-gray-800 min-h-screen">
    <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl dark:text-white">Welcome To The Store</h2>
            <p className="mt-4 text-base font-normal leading-7 text-gray-600 dark:text-white">This is just a test</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-10 lg:mt-16 lg:gap-4 lg:grid-cols-4">
          {cData?.map((item, index) => (
            
            <div className="relative group cursor-pointer bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1" key={index} onClick={() => router.push(`/components/productDetails?id=${item?._id}`)}>
                <div className="overflow-hidden aspect-w-1 aspect-h-1 rounded-t-lg h-48" >
                    <img className="object-cover w-full h-full transition-all duration-300 group-hover:scale-110" src={item.image![0].path} alt={item.name} />
                </div>
                <div className="p-4">
                    <div className="flex items-start justify-between space-x-4">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 sm:text-base md:text-lg dark:text-white truncate">
                                {item?.name}
                            </h3>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 sm:text-base md:text-lg dark:text-white">₹{item?.price}</p>
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 truncate">{item?.description}</p>
                </div>
                <div className="absolute inset-0 rounded-lg ring-1 ring-black ring-opacity-5 pointer-events-none"></div>
            </div>
          ))}

        </div>
    </div>
</section>

  );
}
