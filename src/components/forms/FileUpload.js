import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useSelector } from "react-redux";
import Avatar from "antd/lib/avatar/avatar";
import { Badge } from "antd";

export const FileUpload = ({ values, setValues, setLoading }) => {
    const { user } = useSelector((state) => ({ ...state }));

    const fileUploadAndResize = (evt) => {
        // console.log(evt.target.files)
        let files = evt.target.files;
        let allUploadedFiles = values.images;

        if (files) {
            setLoading(true);
            for (let i = 0; i < files.length; i++) {
                Resizer.imageFileResizer(files[i],
                    720,
                    720,
                    'JPEG',
                    100,
                    0,
                    (uri) => {
                        axios.post(`${process.env.REACT_APP_API}/uploadimages`,
                            { image: uri },
                            {
                                headers: {
                                    authtoken: user ? user.token : ""
                                }
                            }).then(res => {
                                console.log('Image upload res data', res)
                                setLoading(false);
                                allUploadedFiles.push(res.data);
                                setValues({ ...values, images: allUploadedFiles })
                            })
                            .catch(err => {
                                setLoading(false);
                                console.log('Cloudinary upload error', err)
                            })
                    }, 'base64'
                )
            }
        }
    }

    const handleRemove = (public_id) => {
        setLoading(false);
        console.log('remove image', public_id);
        axios.post(`${process.env.REACT_APP_API}/removeimage`, { public_id }, {
            headers: {
                authtoken: user ? user.token : ""
            }
        }).then(res => {
            setLoading(false);
            const { images } = values;
            let filteredImages = images.filter((item) => {
                return item.public_id !== public_id
            });
            setValues({ ...values, images: filteredImages });
        })
            .catch(err => {
                console.log(err);
                setLoading(false);
            })
    }
    return (
        <>
            <div className="row">
                {values.images && values.images.map((image) => (
                    <Badge count="X"
                        key={image.public_id}
                        onClick={() => handleRemove(image.public_id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <Avatar
                            src={image.url}
                            size={100}
                            className="ml-3"
                            shape="square"
                        />
                    </Badge>
                ))}
            </div>
            <div className="row">
                <label
                    className="btn btn-primary btn-raised mt-3">
                    Choose file
            <input
                        type="file"
                        multiple
                        hidden
                        accept="images/*"
                        onChange={fileUploadAndResize} />
                </label>
            </div>
        </>
    )
}