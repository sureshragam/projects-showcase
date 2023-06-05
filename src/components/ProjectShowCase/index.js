import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import {
  ProjectShowCaseContainer,
  ProjectShowCaseContentContainer,
  Select,
  Option,
  ProjectList,
  Project,
  Image,
  Name,
  LoaderContainer,
  FailureContainer,
  FailureImage,
  Heading,
  Para,
  RetryButton,
} from './styledComponents'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstrains = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProjectShowCase extends Component {
  state = {
    activeCategory: categoriesList[0].id,
    apiStatus: apiStatusConstrains.initial,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjectDetails()
  }

  onFetchSuccess = data => {
    const modifiedData = data.map(eachProject => ({
      id: eachProject.id,
      name: eachProject.name,
      imageUrl: eachProject.image_url,
    }))
    this.setState({
      apiStatus: apiStatusConstrains.success,
      projectsList: modifiedData,
    })
    console.log(data)
  }

  onFetchFailure = () => {
    this.setState({apiStatus: apiStatusConstrains.failure})
  }

  getProjectDetails = async () => {
    this.setState({apiStatus: apiStatusConstrains.initial})
    const {activeCategory} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`

    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      this.onFetchSuccess(data.projects)
    } else {
      const data = await response.json()
      this.onFetchFailure(data)
    }
  }

  onChangeCategory = event => {
    this.setState({activeCategory: event.target.value}, this.getProjectDetails)
  }

  renderLoadingView = () => (
    <LoaderContainer data-testid="loader">
      <Loader type="TailSpin" />
    </LoaderContainer>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <ProjectList>
        {projectsList.map(eachProject => {
          const {id, imageUrl, name} = eachProject
          return (
            <Project key={id}>
              <Image src={imageUrl} alt={name} />
              <Name>{name}</Name>
            </Project>
          )
        })}
      </ProjectList>
    )
  }

  renderFailureView = () => (
    <FailureContainer>
      <FailureImage
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <Heading>Oops! Something Went Wrong</Heading>
      <Para>We cannot seem to find the page you are looking for</Para>
      <RetryButton type="button" onClick={this.onClickRetry}>
        Retry
      </RetryButton>
    </FailureContainer>
  )

  renderSomething = apiStatus => {
    switch (apiStatus) {
      case apiStatusConstrains.initial:
        return this.renderLoadingView()
      case apiStatusConstrains.success:
        return this.renderSuccessView()
      case apiStatusConstrains.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  onClickRetry = () => {
    this.getProjectDetails()
  }

  render() {
    const {activeCategory, apiStatus} = this.state
    return (
      <ProjectShowCaseContainer>
        <Header />
        <ProjectShowCaseContentContainer>
          <Select value={activeCategory} onChange={this.onChangeCategory}>
            {categoriesList.map(eachCategory => {
              const {id, displayText} = eachCategory
              return (
                <Option key={id} value={id}>
                  {displayText}
                </Option>
              )
            })}
          </Select>
          {this.renderSomething(apiStatus)}
        </ProjectShowCaseContentContainer>
      </ProjectShowCaseContainer>
    )
  }
}

export default ProjectShowCase
