/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {createContext, useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'

// PageLink şeması
const pageLinkPropTypes = PropTypes.shape({
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    isSeparator: PropTypes.bool
})

// PageLink type for TypeScript
const PageLink = {
    title: '',
    path: '',
    isActive: false,
    isSeparator: false
}

const PageDataContext = createContext({
    setPageTitle: () => {},
    setPageBreadcrumbs: () => {},
    setPageDescription: () => {},
})

const PageDataProvider = ({children}) => {
    const [pageTitle, setPageTitle] = useState('')
    const [pageDescription, setPageDescription] = useState('')
    const [pageBreadcrumbs, setPageBreadcrumbs] = useState([])

    const value = {
        pageTitle,
        setPageTitle,
        pageDescription,
        setPageDescription,
        pageBreadcrumbs,
        setPageBreadcrumbs,
    }

    return <PageDataContext.Provider value={value}>{children}</PageDataContext.Provider>
}

function usePageData() {
    return useContext(PageDataContext)
}

const PageTitle = ({children, description, breadcrumbs}) => {
    const {setPageTitle, setPageDescription, setPageBreadcrumbs} = usePageData()

    useEffect(() => {
        if (children) {
            setPageTitle(children.toString())
        }
        return () => {
            setPageTitle('')
        }
    }, [children])

    useEffect(() => {
        if (description) {
            setPageDescription(description)
        }
        return () => {
            setPageDescription('')
        }
    }, [description])

    useEffect(() => {
        if (breadcrumbs) {
            setPageBreadcrumbs(breadcrumbs)
        }
        return () => {
            setPageBreadcrumbs([])
        }
    }, [breadcrumbs])

    return <></>
}

const PageDescription = ({children}) => {
    const {setPageDescription} = usePageData()

    useEffect(() => {
        if (children) {
            setPageDescription(children.toString())
        }
        return () => {
            setPageDescription('')
        }
    }, [children])

    return <></>
}

// PropTypes tanımlamaları
PageDataProvider.propTypes = {
    children: PropTypes.node
}

PageTitle.propTypes = {
    children: PropTypes.node,
    description: PropTypes.string,
    breadcrumbs: PropTypes.arrayOf(pageLinkPropTypes)
}

PageDescription.propTypes = {
    children: PropTypes.node
}

export {PageDescription, PageTitle, PageDataProvider, usePageData, PageLink}
