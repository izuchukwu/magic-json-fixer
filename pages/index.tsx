import {
	ActionIcon,
	Box,
	BoxProps,
	CopyButton,
	Group,
	JsonInput,
	Stack,
	Text,
	Tooltip
} from '@mantine/core'
import {useDebouncedState} from '@mantine/hooks'
import {CheckIcon, ClipboardIcon} from '@radix-ui/react-icons'
import _ from 'lodash'
import type {NextPage} from 'next'
import Head from 'next/head'
import {useEffect, useState} from 'react'
import styles from '../styles/Home.module.css'
import Spinner from './Spinner'

const EverypromptURL =
	process.env.NODE_ENV === 'production'
		? 'https://everyprompt-service.onrender.com'
		: 'http://localhost:9999'

const runPrompt = async (badJSON: string) => {
	try {
		const epRes = await fetch(
			`${EverypromptURL}/prompt/izu/fix-everyprompt-json`,
			{
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					user: 'testing',
					variables: {json: badJSON}
				})
			}
		)
		const epJSON = await epRes.json()
		return epJSON
	} catch (e) {
		return {success: false, error: -1}
	}
}

const Home: NextPage = () => {
	const [badJSON, setBadJSON] = useDebouncedState('', 300)
	const [fixedJSON, setFixedJSON] = useState<string>()
	const [isLoading, setLoading] = useState(false)

	/** Fix Bad JSON Effect */
	useEffect(() => {
		const asyncFixJSON = async () => {
			if (!badJSON) return
			setFixedJSON('')
			const promptJSON = await runPrompt(badJSON)

			if (!promptJSON.success) {
				// Everyprompt Service Error
				setFixedJSON(`Everyprompt Service Error ${promptJSON.error}`)
			} else if (promptJSON.response.object === 'error') {
				// Everyprompt Error
				setFixedJSON(`Everyprompt Error: ${promptJSON.message}`)
			} else {
				// Success
				setFixedJSON(
					promptJSON.response.choices[0]?.text.trim() ??
						'Could not fix'
				)
			}

			setLoading(false)
		}
		asyncFixJSON()
	}, [badJSON])

	return (
		<div className={styles.container}>
			<Head>
				<title>Magic JSON Fixer</title>
				<meta name="description" content="Magically fix JSON" />
				<link
					rel="icon"
					href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🪄</text></svg>"
				/>
			</Head>

			<Stack sx={{height: '100%'}} justify="center">
				<Text>
					<b>🪄 Magic JSON Fixer</b>
				</Text>
				<Group sx={{height: '100%'}}>
					<JsonInput
						autosize={false}
						sx={{flexGrow: 1}}
						styles={(theme) => ({
							root: {height: '100%'},
							wrapper: {height: '100%'},
							input: {height: '100%'}
						})}
						placeholder="Paste Bad JSON"
						onChange={(value) => {
							setLoading(true)
							setBadJSON(value)
						}}
					/>
					<Text sx={{fontSize: 20, opacity: 0.5}}>→</Text>
					<Box
						sx={{flexGrow: 1, height: '100%', position: 'relative'}}
					>
						<JsonInput
							styles={(theme) => ({
								root: {height: '100%'},
								wrapper: {height: '100%'},
								input: {height: '100%'}
							})}
							placeholder={isLoading ? '' : 'Get Good JSON'}
							readOnly={true}
							value={fixedJSON}
						/>
						<CopyJSONButton
							value={fixedJSON}
							sx={{
								position: 'absolute',
								top: 0,
								right: 0,
								margin: 5
							}}
						/>
						{isLoading && (
							<Group
								sx={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: '100%'
								}}
								position="center"
								align="center"
							>
								<Text>🧠</Text>
								<Spinner color="dark" />
							</Group>
						)}
					</Box>
				</Group>
			</Stack>
		</div>
	)
}

/* -- Copy JSON Btn -- */

type CopyJSONButtonProps = {
	value?: string
} & BoxProps

const CopyJSONButton = ({value, ...props}: CopyJSONButtonProps) => (
	<>
		{value && (
			<Box {...props}>
				<CopyButton value={value} timeout={2000}>
					{({copied, copy}) => (
						<Tooltip
							label={copied ? 'Copied' : 'Copy'}
							withArrow
							position="left"
						>
							<ActionIcon
								color={copied ? 'teal' : 'blue'}
								onClick={copy}
							>
								{copied ? <CheckIcon /> : <ClipboardIcon />}
							</ActionIcon>
						</Tooltip>
					)}
				</CopyButton>
			</Box>
		)}
	</>
)

export default Home
