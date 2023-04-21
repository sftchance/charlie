import "./ProfileImage.css"

const ProfileImage = ({ image }: { image: string | null | undefined }) => {
    if (!image) return <></>

    return <div className="profile">
        <img src={image} alt="Profile" />
    </div>
}

export { ProfileImage }