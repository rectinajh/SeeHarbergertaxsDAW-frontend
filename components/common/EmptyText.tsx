import React from 'react';
// 使用函数组件形式定义，而不是直接JSX赋值
const EmptyTextComponent = () => {
    return (
      <p className="h-[calc(100vh-180px)] max-w-[203] m-auto flex items-center justify-center">
        暂无申请记录，快去首页购买广告进行配置吧
      </p>
    );
  };
  
  // 导出组件实例
  export const emptyText = <EmptyTextComponent />;
  