import React, { DetailedHTMLProps, HTMLAttributes } from 'react'
import { Typography } from 'antd';


const { Text } = Typography;

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    content: string
}
const SuffixText = React.forwardRef<unknown, Props>(({ content }, _ref) => {
    const suffixCount = 6;
    const name = content
    const start = name?.slice(0, name.length - suffixCount);
    const suffix = name?.slice(-suffixCount).trim();
    return (
        <Text ellipsis={{ suffix }}>
            {start}
        </Text>
    )
})
SuffixText.displayName = 'SuffixText'
export default SuffixText