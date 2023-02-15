import { useRouter } from "next/router";


function PostPage() {
	const token = process.env.GITHUB_ACCESS_TOKEN;
	const router = useRouter();
	const postId = router.query.postId as string;
	return <h1>{postId}</h1>;

}

export default PostPage;
