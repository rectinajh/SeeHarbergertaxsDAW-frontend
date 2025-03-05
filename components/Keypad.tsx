import { Drawer } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { DeleteIcon, DownIcon } from '~/icons';
import style from './Keypad.module.scss';
export interface IRef {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    open: boolean
}
interface IProps {
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
    onChange: (isOpen: boolean) => void,
    onOk: () => void
}
const Keypad = React.forwardRef<IRef, IProps>(({ setInputValue, onChange, onOk }, ref) => {
    const [open, setOpen] = useState(false)
    // const [cursorPosition, setCursorPosition] = useState(inputValue?.length);
    const keys = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [0, '.']
    ];
    useImperativeHandle(ref, () => ({
        setOpen,
        open
    }))

    const handleOpen = (isOpen: boolean) => {
        setOpen(isOpen)
        onChange(isOpen)
    }
    const handlePress = (key: string | number) => {
        // console.log(key)

        if (key === 'delete') {
            setInputValue((prev) => prev.slice(0, prev.length - 1));
        } else {
            setInputValue((prev) => prev + key);
        }

    }
    return (
        <Drawer
            mask={false}
            height={'292px'}
            closable={false}
            maskClosable={false}
            closeIcon={false}
            placement='bottom'
            open={open}
            className={style.keypad}
            destroyOnClose={true}
        >
            <div className='bg-white text-center'>
                <p className='py-1' onClick={() => handleOpen(false)}>
                    <DownIcon className="inline-block size-7 text-gray" />
                </p>
                <div className='w-full grid grid-cols-4 '>
                    <div className="col-span-3 grid grid-cols-3 grid-rows-4 ">
                        {keys.flat().map((key, index) => (
                            <button
                                key={index}
                                onClick={() => handlePress(key)}
                                className={`${key == 0 ? 'col-span-2 row-span-1' : 'col-span-1 row-span-1'
                                    } hover:bg-purple_sub flex items-center justify-center h-16  text-lg font-semibold border-t border-r border-gray-light border-opacity-50`}
                            >
                                {key}
                            </button>
                        ))}

                    </div>
                    <div className='grid grid-rows-4 col-span-1'>
                        <button className='row-span-1 border-t border-gray-light border-opacity-50 hover:bg-purple_sub' onClick={() => handlePress('delete')}>
                            <DeleteIcon className="size-6 inline-block" />
                        </button>
                        <button className='row-span-3 bg-purple text-white ' onClick={onOk}>提交</button>
                    </div>
                </div>
            </div>
        </Drawer >

    );
});
Keypad.displayName = "Keypad"
export default Keypad;
