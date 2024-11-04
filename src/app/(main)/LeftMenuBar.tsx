"use client"

import Modal from "@/components/Model";
import { Button } from "@/components/ui/button";
import { BadgeDollarSign } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import olsp from "@/assets/olsp.jpg";


interface MenuBarProps {
  className?: string;
}

export default function LeftMenuBar({ className }: MenuBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility


  return (
    <>
      <div className={className}>
        <Button
          variant="secondary"
          className="flex items-center justify-start gap-3 bg-white w-full"
          title="Affiliates"
          onClick={() => setIsModalOpen(true)} // Open the modal on button click
          aria-label="Open Affiliates link"
        >
          <BadgeDollarSign />
          <span className="hidden lg:inline">Earn Commissions</span>
        </Button>

        {/* Modal for displaying the affiliate link */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-lg font-bold mb-4">Join Our Affiliate Program</h2>
          <small>Discover the secret training and online community that automatically PAYS you commissions every week!</small>
          <p>Click the link below to join:</p>
          <Link href="https://olspsystem.com/join/358198" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          <Image src={olsp} alt={"olsp"}width={1000} height={300} />
            https://olspsystem.com/join/358198
          </Link>
        </Modal>


        
        
      
      </div>
      
    </>
    
  );
}
