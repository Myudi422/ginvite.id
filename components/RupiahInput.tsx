'use client';

import { useState, useEffect } from 'react';

interface RupiahInputProps {
    value: number;
    onChange: (val: number) => void;
    placeholder?: string;
    className?: string;
    autoFocus?: boolean;
}

/**
 * Input teks yang menampilkan format Rupiah (1.000.000) saat mengetik,
 * tapi menyimpan nilai numerik murni ke parent via onChange.
 */
export function RupiahInput({ value, onChange, placeholder = '0', className = '', autoFocus }: RupiahInputProps) {
    const [display, setDisplay] = useState('');

    // Sync display ketika value dari luar berubah (misalnya saat form di-reset)
    useEffect(() => {
        setDisplay(value > 0 ? Number(value).toLocaleString('id-ID') : '');
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '');
        const num = raw === '' ? 0 : parseInt(raw, 10);
        setDisplay(num > 0 ? num.toLocaleString('id-ID') : '');
        onChange(num);
    };

    return (
        <input
            type="text"
            inputMode="numeric"
            value={display}
            onChange={handleChange}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={className}
        />
    );
}
