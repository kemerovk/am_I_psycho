import { Card, Space } from "antd";

export default function СlientCard() {

    return (
      <Space direction="vertical" size={16}>
    <Card title={
        <div className="flex items-center gap-10">
            <img
                src="https://companieslogo.com/img/orig/MGNT.ME-49b3327b.png?t=1720244492"
                alt="ну я"
                style={{
                    width: "20%", // Ширина изображения будет занимать 100% контейнера
                    maxWidth: "30px", // Максимальная ширина изображения
                    height: "auto", // Высота подстраивается автоматически
                    borderRadius: "8px", // Скругленные углы
                }}
            />
            <span>не я(</span>
        </div>
    }
    extra={<a href="#">More</a>}
    style={{ width: 300 }}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  </Space>
    )
  }
  
  