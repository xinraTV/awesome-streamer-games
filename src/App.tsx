import { ColumnsType } from 'antd/es/table';
import './App.css'
import dataJson from './generated/data.json'
import { ConfigProvider, Table, Tag, theme, Typography } from 'antd';
import { GithubOutlined } from '@ant-design/icons';

type MaybeLink = { label: string, url?: string }

const STATUSES = ["Released", "Demo Available", "In Development"] as const

type Status =  typeof STATUSES[number]

type Game = {
  name: MaybeLink,
  developer: MaybeLink,
  streamLanguage: string,
  status: Status
  genres: string[]
}

const { Title } = Typography;
const data = dataJson as Game[]

const columns : ColumnsType<Game> = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    render: renderMaybeLink,
    sorter: (a, b) => a.name.label.localeCompare(b.name.label),
    defaultSortOrder: 'ascend'
  },
  {
    key: 'developer',
    title: 'Developer',
    dataIndex: 'developer',
    render: (developer: MaybeLink) => <>{renderMaybeLink(developer)} <img className='shield' alt="Twitch Status" src={`https://img.shields.io/twitch/status/${developer.label}?style=flat&label=`} /></>,
    sorter: (a, b) => a.developer.label.localeCompare(b.developer.label)
  },
  {
    key: 'streamLanguage',
    title: 'Stream Language',
    dataIndex: 'streamLanguage',
    sorter: (a, b) => a.name.label.localeCompare(b.name.label),
    filters: data.map(game => game.streamLanguage).filter((value, index, self) => self.indexOf(value) === index).map(language => ({ text: language, value: language })),
    onFilter: (value, game) => game.streamLanguage === value,
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    render: renderStatus,
    sorter: (a, b) => a.status.localeCompare(b.status),
    filters: STATUSES.map(status => ({ text: renderStatus(status), value: status })),
    onFilter: (value, game) => game.status === value,
  },
  {
    key: 'genres',
    title: 'Genres',
    dataIndex: 'genres',
    render: (genres: string[]) => genres.join(', '),
    filters: data.flatMap(game => game.genres).filter((value, index, self) => self.indexOf(value) === index).map(genre => ({ text: genre, value: genre })),
    onFilter: (value, game) => game.genres.includes(value as string),
  },
];

function renderStatus(status: Status) {
  switch (status) {
    case 'Released':
      return <Tag color='success'>{status}</Tag>
    case 'Demo Available':
      return <Tag color='processing'>{status}</Tag>
    case 'In Development':
      return <Tag color='warning'>{status}</Tag>
  }
}

function renderMaybeLink(link: MaybeLink) {
  // explicitly no noreferrer
  return link.url ? <a href={link.url} target='_blank'>{link.label}</a> : link.label
}

function App() {

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className='container'>
        <Title>Awesome Streamer Games</Title>
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          bordered
          title={() => 'A curated list of awesome games made by indie developers live on Twitch.'}
          footer={() => <>Collaborate on <GithubOutlined /> <a target='_blank' href='https://github.com/xinraTV/awesome-streamer-games'>GitHub</a>.</>}
        />
      </div>
    </ConfigProvider>
  )
}

export default App
