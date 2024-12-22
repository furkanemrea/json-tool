import React, { useState, useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import ReactFlow, { 
  Node, 
  Edge,
  Controls, 
  Background,
  Position,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
  MiniMap,
  ReactFlowProvider
} from 'reactflow';
import { toPng } from 'html-to-image';
import 'reactflow/dist/style.css';
import './JsonMap.css';
import { Layout, Typography, Row, Col, Input, Card, Button, Space, Tooltip, Alert } from 'antd';
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  UndoOutlined,
  RedoOutlined,
  SaveOutlined,
  PictureOutlined,
  DownloadOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const JsonMap = () => {
  const [inputJson, setInputJson] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const flowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inputJson) {
      setNodes([]);
      setEdges([]);
      setError(null);
      return;
    }

    try {
      let parsed;
      try {
        parsed = JSON.parse(inputJson);
      } catch (parseError) {
        const cleanedInput = inputJson
          .replace(/^\uFEFF/, '')
          .replace(/[\u201C\u201D]/g, '"')
          .replace(/[\u2018\u2019]/g, "'");
        
        parsed = JSON.parse(cleanedInput);
      }

      if (!parsed || typeof parsed !== 'object') {
        setError('Invalid JSON structure');
        setNodes([]);
        setEdges([]);
        return;
      }

      const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(parsed);
      setNodes(newNodes);
      setEdges(newEdges);
      setError(null);

    } catch (err) {
      console.error('JSON Parse Error:', err);
      setError(`Invalid JSON format: ${err.message}`);
      setNodes([]);
      setEdges([]);
    }
  }, [inputJson, setNodes, setEdges]);

  const createNodesAndEdges = (data: any) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let nodeId = 0;
    const HORIZONTAL_SPACING = 300;
    const VERTICAL_SPACING = 150;
    const GROUP_SPACING = 400;
    const SIBLING_SPACING = 100;
    const SAFETY_MARGIN = 50;
    const levelHeights: { [key: number]: { [key: string]: number } } = {};
    
    const getSingularName = (pluralName: string): string => {
      if (pluralName.endsWith('ies')) return pluralName.slice(0, -3) + 'y';
      if (pluralName.endsWith('s')) return pluralName.slice(0, -1);
      return pluralName;
    };

    const getYPosition = (level: number, parentId: string | null, index: number, isSameArray: boolean): number => {
      if (!levelHeights[level]) {
        levelHeights[level] = {};
      }
      
      if (!parentId) {
        return index * (GROUP_SPACING + SAFETY_MARGIN);
      }

      if (!levelHeights[level][parentId]) {
        const parentNode = nodes.find(n => n.id === parentId);
        levelHeights[level][parentId] = parentNode ? parentNode.position.y : 0;
      }

      const currentY = levelHeights[level][parentId];
      levelHeights[level][parentId] += (isSameArray ? SIBLING_SPACING : GROUP_SPACING) + SAFETY_MARGIN;
      return currentY;
    };

    const processObject = (
      obj: any, 
      parentId: string | null = null, 
      label: string = '', 
      level = 0,
      verticalIndex = 0,
      isNewGroup = false,
      arrayGroupName: string = ''
    ) => {
      const currentId = `node-${nodeId++}`;
      const primitiveEntries: string[] = [];
      const objectEntries: [string, any][] = [];

      Object.entries(obj).forEach(([key, value]) => {
        if (value !== null && typeof value === 'object') {
          objectEntries.push([key, value]);
        } else {
          primitiveEntries.push(`${key}: ${formatValue(value)}`);
        }
      });

      const xPos = level * (HORIZONTAL_SPACING + SAFETY_MARGIN);
      const yPos = getYPosition(level, parentId, verticalIndex, false);

      nodes.push({
        id: currentId,
        data: { 
          label: (
            <div className={`node-content level-${level}`}>
              <div className="node-title" style={{ 
                color: getColorForLevel(level),
                fontWeight: 600,
                marginBottom: '8px',
                borderBottom: `1px solid ${getColorForLevel(level)}`,
                paddingBottom: '4px'
              }}>
                {label}
              </div>
              <div className="node-properties">
                {primitiveEntries.map((entry, i) => (
                  <div key={i} className="node-property" style={{
                    padding: '4px 0',
                    fontSize: '12px'
                  }}>
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        position: { x: xPos, y: yPos },
        style: getNodeStyle(level)
      });

      if (parentId) {
        edges.push({
          id: `edge-${parentId}-${currentId}`,
          source: parentId,
          target: currentId,
          type: 'smoothstep',
          animated: true,
          style: getEdgeStyle(level)
        });
      }

      objectEntries.forEach(([key, value], index) => {
        if (Array.isArray(value)) {
          processArray(value, currentId, key, level + 1, index);
        } else {
          processObject(
            value,
            currentId,
            key,
            level + 1,
            index,
            index > 0
          );
        }
      });
    };

    const processArray = (
      arr: any[],
      parentId: string,
      arrayName: string,
      level: number,
      verticalIndex: number
    ) => {
      const arrayId = `array-${nodeId++}`;
      const singularName = getSingularName(arrayName);
      
      nodes.push({
        id: arrayId,
        data: {
          label: (
            <div className={`node-content level-${level}`}>
              <div className="node-title" style={{ 
                color: getColorForLevel(level),
                fontWeight: 600,
                marginBottom: '8px',
                borderBottom: `1px solid ${getColorForLevel(level)}`,
                paddingBottom: '4px'
              }}>
                {arrayName}
              </div>
            </div>
          ),
        },
        position: { 
          x: level * (HORIZONTAL_SPACING + SAFETY_MARGIN),
          y: getYPosition(level, parentId, verticalIndex, false)
        },
        style: getNodeStyle(level, true)
      });

      edges.push({
        id: `edge-${parentId}-${arrayId}`,
        source: parentId,
        target: arrayId,
        type: 'smoothstep',
        animated: true,
        style: getEdgeStyle(level)
      });

      arr.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          processObject(
            item,
            arrayId,
            `${singularName} ${index + 1}`,
            level + 1,
            index,
            true,
            singularName
          );
        } else {
          const itemId = `node-${nodeId++}`;
          nodes.push({
            id: itemId,
            data: {
              label: (
                <div className={`node-content level-${level + 1}`}>
                  <div className="node-title" style={{ 
                    color: getColorForLevel(level + 1),
                    fontWeight: 600,
                    marginBottom: '8px',
                    borderBottom: `1px solid ${getColorForLevel(level + 1)}`,
                    paddingBottom: '4px'
                  }}>
                    {`${singularName} ${index + 1}`}
                  </div>
                  <div className="node-property" style={{
                    padding: '4px 0',
                    fontSize: '12px'
                  }}>
                    {formatValue(item)}
                  </div>
                </div>
              ),
            },
            position: {
              x: (level + 1) * (HORIZONTAL_SPACING + SAFETY_MARGIN),
              y: getYPosition(level + 1, arrayId, index, true)
            },
            style: getNodeStyle(level + 1)
          });

          edges.push({
            id: `edge-${arrayId}-${itemId}`,
            source: arrayId,
            target: itemId,
            type: 'smoothstep',
            animated: true,
            style: getEdgeStyle(level + 1)
          });
        }
      });
    };

    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        processObject(item, null, `Item ${index + 1}`, 0, index, index > 0);
      });
    } else {
      processObject(data);
    }

    return { nodes, edges };
  };

  const getNodeStyle = (level: number, isArrayParent: boolean = false) => ({
    background: isArrayParent ? '#f0f9ff' : '#ffffff',
    border: `2px solid ${getColorForLevel(level)}`,
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    fontSize: '13px',
    width: 'auto',
    minWidth: '200px',
    maxWidth: '300px'
  });

  const getColorForLevel = (level: number) => {
    const colors = [
      '#2563eb', // blue
      '#7c3aed', // purple
      '#059669', // green
      '#b45309', // amber
      '#dc2626', // red
    ];
    return colors[level % colors.length];
  };

  const getEdgeStyle = (level: number) => ({
    stroke: getColorForLevel(level),
    strokeWidth: 3,
  });

  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return `[${value.map(item => typeof item === 'string' ? `"${item}"` : item).join(', ')}]`;
    }
    if (typeof value === 'string') return `"${value}"`;
    if (value === null) return 'null';
    return String(value);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      flowRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const onNodeDoubleClick = (event: React.MouseEvent, node: Node) => {
    const newLabel = prompt('Edit node label:', node.data.label.props.children[0].props.children);
    if (newLabel) {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              data: {
                ...n.data,
                label: (
                  <div className={`node-content level-${n.data.label.props.className.split('-')[1]}`}>
                    <div className="node-title" style={{ color: n.data.label.props.children[0].props.style.color }}>
                      {newLabel}
                    </div>
                    {n.data.label.props.children[1]}
                  </div>
                ),
              },
            };
          }
          return n;
        })
      );
    }
  };

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => [...eds, { ...params, type: 'smoothstep', animated: true }]);
  }, [setEdges]);

  const downloadImage = useCallback(() => {
    if (flowRef.current === null) {
      return;
    }

    const downloadButton = document.createElement('a');
    
    toPng(flowRef.current, {
      backgroundColor: '#fff',
      width: flowRef.current.offsetWidth * 2,
      height: flowRef.current.offsetHeight * 2,
      style: {
        transform: 'scale(2)',
        transformOrigin: 'top left'
      }
    })
      .then((dataUrl) => {
        downloadButton.download = 'json-diagram.png';
        downloadButton.href = dataUrl;
        downloadButton.click();
      })
      .catch((error) => {
        console.error('Error downloading image:', error);
      });
  }, []);

  const saveAsJson = useCallback(() => {
    if (!rfInstance) return;

    const flow = rfInstance.toObject();
    const dataStr = JSON.stringify(flow, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataUri);
    downloadAnchor.setAttribute('download', 'flow.json');
    downloadAnchor.click();
  }, [rfInstance]);

  const onInit = (reactFlowInstance: ReactFlowInstance) => {
    setRfInstance(reactFlowInstance);
  };

  const handleZoomIn = () => {
    rfInstance?.zoomIn();
  };

  const handleZoomOut = () => {
    rfInstance?.zoomOut();
  };

  const handleResetView = () => {
    rfInstance?.setViewport({ x: 0, y: 0, zoom: 1 });
  };

  const controlButtons = (
    <div style={{ 
      position: 'absolute', 
      top: 20, 
      right: 20, 
      zIndex: 4,
      background: 'white',
      padding: '8px',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    }}>
      <Space>
        <Tooltip title="Zoom In">
          <Button
            type="text"
            icon={<ZoomInOutlined />}
            onClick={handleZoomIn}
          />
        </Tooltip>
        <Tooltip title="Zoom Out">
          <Button
            type="text"
            icon={<ZoomOutOutlined />}
            onClick={handleZoomOut}
          />
        </Tooltip>
        <Tooltip title="Reset View">
          <Button
            type="text"
            icon={<UndoOutlined />}
            onClick={handleResetView}
          />
        </Tooltip>
        <div style={{ width: '1px', background: '#f0f0f0', height: '24px' }} />
        <Tooltip title="Toggle Fullscreen">
          <Button
            type="text"
            icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            onClick={toggleFullscreen}
          />
        </Tooltip>
        <div style={{ width: '1px', background: '#f0f0f0', height: '24px' }} />
        <Tooltip title="Save as Image">
          <Button
            type="text"
            icon={<PictureOutlined />}
            onClick={downloadImage}
          />
        </Tooltip>
        <Tooltip title="Download JSON">
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={saveAsJson}
          />
        </Tooltip>
      </Space>
    </div>
  );

  return (
    <Layout style={{ height: '100vh' }}>
      <Content style={{ height: '100%', display: 'flex' }}>
        {/* JSON Input Panel */}
        <div style={{ 
          width: '350px', 
          height: '100%', 
          borderRight: '1px solid #f0f0f0',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
            <Title level={4} style={{ margin: 0 }}>JSON Input</Title>
          </div>
          <div style={{ 
            flex: 1, 
            padding: '16px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <TextArea
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              placeholder="Paste your JSON here..."
              style={{ 
                flex: 1,
                resize: 'none',
                fontFamily: 'monospace',
                fontSize: '13px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '8px'
              }}
            />
            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                style={{ marginTop: '16px' }}
                showIcon
              />
            )}
          </div>
        </div>

        {/* Diagram Panel */}
        <div style={{ 
          flex: 1, 
          height: '100%',
          position: 'relative',
          backgroundColor: '#fafafa'
        }}>
          <ReactFlowProvider>
            <div ref={flowRef} style={{ height: '100%' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onInit={onInit}
                fitView
                minZoom={0.1}
                maxZoom={1.5}
                defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
                nodesDraggable={false}
                elementsSelectable={false}
                attributionPosition="bottom-left"
              >
                <Background color="#aaa" gap={16} />
                {controlButtons}
              </ReactFlow>
            </div>
          </ReactFlowProvider>
        </div>
      </Content>
    </Layout>
  );
};

export default JsonMap; 