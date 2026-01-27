# Static Site Deployment

1. Build the project locally
2. Push the result to GitHub
3. GitHub Actions will handle the deployment

## Configuration

The site is configured to use GitHub Actions for deployment. This ensures that:
- TypeScript is checked
- Assets are minified and bundled
- React Router works correctly with professional build settings

## How to Deploy manually (if needed)
`npm run build`
`git add dist -f`
`git commit -m "deploy"`
`git push`

(Note: The automated workflow is preferred)
