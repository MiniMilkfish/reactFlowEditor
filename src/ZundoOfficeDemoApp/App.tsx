import { temporal, type TemporalState } from "zundo";
import { create } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional"; // replace 'useStore'
import { immer } from "zustand/middleware/immer";
import { Button, Flex, Col, Row } from "antd";

interface MyState {
  bears: number;
  increment: () => void;
  decrement: () => void;
}

const useMyStore = create(
  immer(
    temporal<MyState>((set) => ({
      bears: 0,
      increment: () => set((state) => ({ bears: state.bears + 1 })),
      decrement: () => set((state) => ({ bears: state.bears - 1 })),
    })),
  ),
);

const useTemporalStore = <T extends unknown>(
  selector: (state: TemporalState<MyState>) => T,
  equality?: (a: T, b: T) => boolean,
) => useStoreWithEqualityFn(useMyStore.temporal, selector, equality);

const App = () => {
  const store = useMyStore();
  const { bears, increment, decrement } = store;
  const { undo, redo, futureStates, pastStates } = useTemporalStore(
    (state) => state,
  );

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1
        style={{ textAlign: "center", marginBottom: "32px", color: "#1890ff" }}
      >
        Zundo 状态管理演示
      </h1>

      <Row gutter={[24, 24]}>
        {/* 当前状态显示区域 */}
        <Col xs={24} md={12}>
          <div
            style={{
              background: "#f0f2f5",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #d9d9d9",
            }}
          >
            <h2 style={{ color: "#52c41a", marginBottom: "16px" }}>
              🐻 当前状态
            </h2>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
                color: "#1890ff",
                marginBottom: "16px",
              }}
            >
              Bears: {bears}
            </div>
            <Flex gap="middle" justify="center">
              <Button type="primary" size="large" onClick={() => increment()}>
                ➕ 增加
              </Button>
              <Button size="large" onClick={() => decrement()}>
                ➖ 减少
              </Button>
            </Flex>
          </div>
        </Col>

        {/* 时间旅行控制区域 */}
        <Col xs={24} md={12}>
          <div
            style={{
              background: "#fff7e6",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #ffd591",
            }}
          >
            <h2 style={{ color: "#fa8c16", marginBottom: "16px" }}>
              ⏰ 时间旅行
            </h2>
            <Flex
              gap="middle"
              justify="center"
              style={{ marginBottom: "16px" }}
            >
              <Button
                type="default"
                size="large"
                disabled={pastStates.length === 0}
                onClick={() => undo()}
              >
                ↶ 撤销 ({pastStates.length})
              </Button>
              <Button
                type="default"
                size="large"
                disabled={futureStates.length === 0}
                onClick={() => redo()}
              >
                ↷ 重做 ({futureStates.length})
              </Button>
            </Flex>
          </div>
        </Col>

        {/* 历史状态显示区域 */}
        <Col xs={24}>
          <div
            style={{
              background: "#f6ffed",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #b7eb8f",
            }}
          >
            <h2 style={{ color: "#52c41a", marginBottom: "16px" }}>
              📊 状态历史
            </h2>

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={8}>
                <div
                  style={{
                    background: "#fff",
                    padding: "12px",
                    borderRadius: "6px",
                    border: "1px solid #d9d9d9",
                  }}
                >
                  <h3 style={{ color: "#722ed1", marginBottom: "8px" }}>
                    过去状态:
                  </h3>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      wordBreak: "break-all",
                      maxHeight: "100px",
                      overflow: "auto",
                    }}
                  >
                    {JSON.stringify(pastStates, null, 2)}
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={8}>
                <div
                  style={{
                    background: "#fff",
                    padding: "12px",
                    borderRadius: "6px",
                    border: "1px solid #d9d9d9",
                  }}
                >
                  <h3 style={{ color: "#1890ff", marginBottom: "8px" }}>
                    当前完整状态:
                  </h3>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      wordBreak: "break-all",
                      maxHeight: "100px",
                      overflow: "auto",
                    }}
                  >
                    {JSON.stringify(store, null, 2)}
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={8}>
                <div
                  style={{
                    background: "#fff",
                    padding: "12px",
                    borderRadius: "6px",
                    border: "1px solid #d9d9d9",
                  }}
                >
                  <h3 style={{ color: "#fa541c", marginBottom: "8px" }}>
                    未来状态:
                  </h3>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      wordBreak: "break-all",
                      maxHeight: "100px",
                      overflow: "auto",
                    }}
                  >
                    {JSON.stringify(futureStates, null, 2)}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default App;
