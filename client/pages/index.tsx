import styles from '@/styles/Home.module.css'
import { useMutation, useQuery } from 'react-query'
import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { FileUploader } from 'react-drag-drop-files'
import { queryClient } from './_app'

export default function Home() {
	const fileTypes = ['JSON']
	const [toDelete, setToDelete] = useState<string>('')
	const [currentlySelected, setCurrentlySelected] = useState('')

	const { isLoading, data } = useQuery({
		queryKey: 'listObjects',
		queryFn: () =>
			axios.get(`http://localhost:1000/list`).then((res) => res.data),
	})

	const deleteMutation = useMutation({
		mutationKey: 'delete',
		mutationFn: ({ key }: any) =>
			axios.delete(`http://localhost:1000/delete?key=${key}`),
		retry: 0,
		onSuccess: async (res) => {
			await queryClient.invalidateQueries('listObjects')
			toast.success(`data successfully deleted`)
		},
		onError: (error: any) => {
			toast.error(`${error.response.data.message}`)
		},
	})

	const uploadMutation = useMutation({
		mutationKey: 'upload',
		mutationFn: ({ file }: any) => {
			const formData = new FormData()
			formData.append('file', file)
			return axios.post('http://localhost:1000/upload', formData)
		},
		retry: 0,
		onSuccess: async (res) => {
			await queryClient.invalidateQueries('listObjects')
			toast.success(`data successfully uploaded`)
		},
		onError: (error: any) => {
			toast.error(`${error.response.data.message}`)
		},
	})

	const handleUpload = (file: any) => {
		uploadMutation.mutate({ file: file })
	}

	const handleDelete = (toDelete: any) => {
		deleteMutation.mutate({ key: toDelete })
	}

	if (isLoading) {
		return <h1>Loading...</h1>
	}

	const listObjects = data.objects.map((object: any) => (
		<p style={{ display: 'flex', flexDirection: 'row' }}>
			<li
				style={
					currentlySelected == object.name ? { backgroundColor: 'green' } : {}
				}
				key={object.name}
			>
				name: {object.name}
			</li>
			<button
				onClick={() => {
					setCurrentlySelected(object.name)
					setToDelete(object.name)
				}}
			>
				select this to delete
			</button>
		</p>
	))

	return (
		<div>
			<h1>Upload your file here</h1>
			<FileUploader
				handleChange={(file: any) => handleUpload(file)}
				name="file"
				label="upload json file"
				types={fileTypes}
				multiple={false}
			/>

			<h1>select an object to delete</h1>
			<ul>{listObjects}</ul>
			<button onClick={() => handleDelete(toDelete)}>delete from s3</button>
		</div>
	)
}
