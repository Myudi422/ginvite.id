"use client";

import { AnimatePresence, motion } from "framer-motion";
import QRCode from "react-qr-code";
import { FaQrcode } from 'react-icons/fa';

interface QRModalProps {
  show: boolean;
  onClose: () => void;
  qrData: string;
}

export default function QRModal({ show, onClose, qrData }: QRModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-white rounded-lg p-6 max-w-xs w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">QR CHECK-IN</h3>
              <button onClick={onClose} className="text-gray-500 text-xl leading-none">
                &times;
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <QRCode value={qrData} size={200} />
            </div>
            <div className="flex flex-col items-center gap-3">
              <FaQrcode className="text-2xl text-red-600" />
              <p className="text-sm font-semibold text-gray-700">
                Scan QR Anda
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}