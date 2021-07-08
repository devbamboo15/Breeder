import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'

const DarkOptionButton = ({ children, onClick, selected, img }) => {
    return (
        <div className={styles.btn_dark} style={{ background: selected && '#353261' }}>
            <Image
                src={img ? img : "/dot_BTC.png"}
                alt="start Icon"
                width={8}
                height={8}
                />
            <button className={styles.btn} onClick={() => onClick(children)}>{children || 'Button'}</button>
        </div>
    );
}

export default DarkOptionButton;