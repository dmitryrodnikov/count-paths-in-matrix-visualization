import React, { useState } from 'react';
import styles from './radio-switch.module.css';

import cn from 'classnames';

interface RadioSwitchProps<T> {
    values: { label: string; value: T }[];
    onChange: (value: T) => void;
}

export const RadioSwitch = <T,>({ values, onChange }: RadioSwitchProps<T>) => {
    const [selected, setSelected] = useState(0);

    return (
        <div className={styles.container}>
            {values.map(({ label, value }, index) => {
                return (
                    <button
                        className={cn(styles.item, index === selected && styles.selected)}
                        onClick={() => {
                            setSelected(index);
                            onChange(value);
                        }}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
};
