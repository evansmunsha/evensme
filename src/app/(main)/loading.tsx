import Image from "next/image";

 

export default function Loading() {
  return (
    <div className="flex items-center justify-center mx-auto h-auth">
      <Image src='/thumbnail.png' width={40} height={40} alt='logo' className=' mx-auto   animate-spin rounded-full ' />
    </div>
  );
}
