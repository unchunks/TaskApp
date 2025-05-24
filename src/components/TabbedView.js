import React, { useState } from 'react';

const TabbedView = ({ children, tabLabels }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
                {tabLabels.map((label, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            background: activeTab === index ? '#ddd' : '#eee',
                            cursor: 'pointer',
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <div>
                {children[activeTab]}
            </div>
        </div>
    );
};

export default TabbedView;
