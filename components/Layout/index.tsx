import React from 'react';
import { Layout as AntLayout } from 'antd';
import SideBar from '../SideBar';

const { Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AntLayout>
      <SideBar />
      <AntLayout style={{ marginLeft: 200 }}>
        <Content style={{ margin: '24px 16px', minHeight: 280 }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout; 