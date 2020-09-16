import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import User from '@modules/user/infra/typeorm/entities/User';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

interface RequestDTO {
    user_id: string;
    avatarFilename: string;
}

class UpdateUserAvatarService {
    public async execute({
        user_id,
        avatarFilename,
    }: RequestDTO): Promise<User> {
        const usersRespository = getRepository(User);
        const user = await usersRespository.findOne(user_id);

        if (!user) {
            throw new AppError(
                'Only authenticated users can change avatar.',
                401,
            );
        }

        if (user.avatar) {
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );
            const userAvatarFileExists = await fs.promises.stat(
                userAvatarFilePath,
            );

            if (userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFilename;
        await usersRespository.save(user);
        return user;
    }
}

export default UpdateUserAvatarService;
