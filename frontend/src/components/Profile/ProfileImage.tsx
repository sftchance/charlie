import "./ProfileImage.css"

const ProfileImage = ({ image }: { image: string | null | undefined }) => {
    if (!image) return <></>

    return <div>
        <img src={image} alt="Profile" />
    </div>
}

export { ProfileImage }