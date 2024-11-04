
import Image from "next/image";

export default function Loading() {
  return (
    <div className="mx-auto items-center flex h-[100vh] justify-center">

      <Image src='/thumbnail.png' width={40} height={40} alt='logo' className=' mx-auto animate-spin rounded-full ' />
    </div>

  ); 
}
