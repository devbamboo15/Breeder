import React from 'react';
import styles from './styles.module.css';

const TextOptionButton = ({ children, onClick, selected }) => {
    return (
        <button className={styles.btn_text_option} style={{ color: selected && '#65c4ca' }} onClick={() => onClick(children)}>{children || 'Button'}</button>
    );
}

export default TextOptionButton;